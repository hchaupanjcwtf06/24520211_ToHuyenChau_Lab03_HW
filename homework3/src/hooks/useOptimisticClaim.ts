import { useState, useCallback, useRef } from 'react';
import type { SupplyItem, ClaimTransactionStatus } from '../types/pubg';

interface UseOptimisticClaimOptions {
  readonly initialItems: readonly SupplyItem[];
  // Cho phép can thiệp API giả lập phục vụ kiểm thử tự động
  readonly mockClaimApi?: (item: SupplyItem) => Promise<{ status: number; message: string }>;
}

interface ClaimResult {
  readonly items: readonly SupplyItem[];
  readonly claimingId: string | null;
  readonly transactionStatus: ClaimTransactionStatus;
  readonly errorMessage: string | null;
  readonly claimItem: (itemId: string) => Promise<boolean>;
  readonly clearError: () => void;
}

export function useOptimisticClaim({
  initialItems,
  mockClaimApi,
}: UseOptimisticClaimOptions): ClaimResult {
  const [items, setItems] = useState<readonly SupplyItem[]>(initialItems);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<ClaimTransactionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Snapshot lưu trạng thái kho trước khi trừ lạc quan để rollback khi gặp 409
  const previousItemsSnapshotRef = useRef<readonly SupplyItem[]>(initialItems);

  const clearError = useCallback(() => {
    setErrorMessage(null);
    setTransactionStatus('idle');
  }, []);

  const claimItem = useCallback(
    async (itemId: string): Promise<boolean> => {
      // 1. T10 - Idempotency Guard: Chặn bấm liên tục khi đang có giao dịch đang chờ
      if (claimingId !== null) {
        return false;
      }

      const targetItem = items.find(i => i.id === itemId);
      if (!targetItem || targetItem.availableStock <= 0) {
        setErrorMessage('Vật phẩm này đã hết hàng trong thùng thính!');
        setTransactionStatus('conflict_error');
        return false;
      }

      // Lưu snapshot trước khi cập nhật
      previousItemsSnapshotRef.current = items;
      setClaimingId(itemId);
      setTransactionStatus('claiming');
      setErrorMessage(null);

      // 2. T08 - Optimistic Update: Trừ tồn kho cục bộ ngay lập tức
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, availableStock: item.availableStock - 1 }
            : item
        )
      );

      try {
        let response: { status: number; message: string };

        if (mockClaimApi) {
          response = await mockClaimApi(targetItem);
        } else {
          // Giả lập độ trễ mạng 600ms
          await new Promise(resolve => setTimeout(resolve, 600));

          // Mô phỏng 409 Conflict: Nếu vật phẩm là skin M416 hoặc kho chỉ còn 1 slot cuối
          if (targetItem.id === 'supply-m416-pvs-skin' && targetItem.availableStock === 1) {
            response = {
              status: 409,
              message: 'Lỗi 409 Conflict: Một người chơi khác đã loot skin M416 trước bạn trong mili-giây!',
            };
          } else {
            response = {
              status: 200,
              message: 'Nhận vật phẩm thành công!',
            };
          }
        }

        // 3. T11 - Kiểm tra mã phản hồi: Rollback nếu gặp mã 409
        if (response.status === 409) {
          setItems(previousItemsSnapshotRef.current);
          setErrorMessage(response.message);
          setTransactionStatus('conflict_error');
          return false;
        }

        setTransactionStatus('success');
        return true;
      } catch (err) {
        // Rollback nếu có lỗi mạng
        setItems(previousItemsSnapshotRef.current);
        const errMsg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ!';
        setErrorMessage(`Lỗi mạng: ${errMsg}`);
        setTransactionStatus('conflict_error');
        return false;
      } finally {
        setClaimingId(null);
      }
    },
    [claimingId, items, mockClaimApi]
  );

  return {
    items,
    claimingId,
    transactionStatus,
    errorMessage,
    claimItem,
    clearError,
  };
}