import type { SupplyItem, ClaimTransactionStatus } from '../types/pubg';
import { formatVnd, formatGCoin } from '../utils/formatters';
import styles from './ClaimStation.module.css';

interface ClaimStationProps {
  readonly items: readonly SupplyItem[];
  readonly claimingId: string | null;
  readonly transactionStatus: ClaimTransactionStatus;
  readonly errorMessage: string | null;
  readonly isAirdropActive: boolean;
  readonly onClaim: (itemId: string) => Promise<boolean>;
  readonly onClearError: () => void;
}

export function ClaimStation({
  items,
  claimingId,
  transactionStatus,
  errorMessage,
  isAirdropActive,
  onClaim,
  onClearError,
}: ClaimStationProps) {
  return (
    <section className={styles.claimSection} aria-labelledby="claim-station-heading">
      <div className={styles.header}>
        <h2 id="claim-station-heading" className={styles.title}>
          Trạm Nhận Quà & Vé PVS Tiếp Tế (Optimistic Claim)
        </h2>
        <span className={styles.tagline}>
          Cơ chế trừ kho tức thì &bull; Rollback an toàn khi xung đột 409
        </span>
      </div>

      {/* Thông báo lỗi 409 Conflict chuẩn A11y role="alert" */}
      {errorMessage && (
        <section className={styles.alertError} role="alert" aria-live="assertive">
          <div className={styles.alertContent}>
            <strong>Cảnh Báo Xung Đột Hệ Thống:</strong> {errorMessage}
          </div>
          <button
            type="button"
            className={styles.dismissButton}
            onClick={onClearError}
            aria-label="Đóng thông báo cảnh báo"
          >
            Đóng
          </button>
        </section>
      )}

      {/* Trạng thái thành công */}
      {transactionStatus === 'success' && !errorMessage && (
        <output className={styles.alertSuccess} role="status">
          Nhận quà thành công! Vật phẩm đã được chuyển vào balo tài khoản của bạn.
        </output>
      )}

      <ul className={styles.itemList}>
        {items.map(item => {
          const isThisClaiming = claimingId === item.id;
          const isOutOfStock = item.availableStock <= 0;
          const isDisabled = !isAirdropActive || isOutOfStock || isThisClaiming || claimingId !== null;

          return (
            <li key={item.id} className={styles.itemCard}>
              <div className={styles.itemMeta}>
                <span className={styles.itemType}>{item.type}</span>
                <h3 className={styles.itemName}>{item.name}</h3>
                <div className={styles.priceRow}>
                  {item.priceVnd > 0 && <span className={styles.priceVnd}>{formatVnd(item.priceVnd)}</span>}
                  {item.priceGCoin > 0 && <span className={styles.priceGCoin}>{formatGCoin(item.priceGCoin)}</span>}
                  {item.priceVnd === 0 && item.priceGCoin === 0 && <span className={styles.priceFree}>Miễn Phí</span>}
                </div>
              </div>

              <div className={styles.stockActionRow}>
                <div className={styles.stockInfo}>
                  <span className={styles.stockLabel}>Còn lại:</span>
                  <span className={`${styles.stockValue} ${isOutOfStock ? styles.stockZero : ''}`}>
                    {item.availableStock} / {item.originalStock}
                  </span>
                </div>

                <button
                  type="button"
                  className={styles.claimButton}
                  onClick={() => onClaim(item.id)}
                  disabled={isDisabled}
                  aria-busy={isThisClaiming}
                  aria-label={`Nhận ${item.name}`}
                >
                  {isThisClaiming ? 'Đang xác nhận...' : isOutOfStock ? 'Hết Hàng' : 'Loot Thính'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}