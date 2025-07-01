import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const TransactionBillCart = ({ items, onQtyChange, onRemove, onSaveBill }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleTransaction = () => {
    onSaveBill("Transaction");
  };

  return (
    <div className="w-full md:w-[300px] lg:w-[350px] bg-gray-100 h-screen p-4 shadow-inner overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Transaction Bill</h2>

      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-gray-500">No items added.</p>
        ) : (
          items.map((item) => {
            const qtyValue = item.qty === 0 ? "" : item.qty;
            const id = item.cartId;
            const name = item.name || item.itemName;

            return (
              <div key={id} className="bg-white p-3 rounded shadow-sm flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">{name}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onRemove(id)}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQtyChange(id, -1)}
                      className="bg-gray-200 rounded p-1 hover:bg-gray-300"
                      disabled={item.qty <= 0}
                    >
                      <FaMinus size={12} />
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={qtyValue}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          onQtyChange(id, 0, true);
                        } else {
                          const parsed = parseInt(value);
                          if (!isNaN(parsed) && parsed >= 0) {
                            onQtyChange(id, parsed, true);
                          }
                        }
                      }}
                      className="w-12 text-center border rounded px-1 py-[2px] focus:outline-none"
                    />

                    <button
                      onClick={() => onQtyChange(id, 1)}
                      className="bg-gray-200 rounded p-1 hover:bg-gray-300"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>

                  <span className="font-medium">
                    Rs. {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>

                <small className="text-xs text-gray-500">
                  Stock: {item.quantity ?? "Unknown"}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t mt-4 pt-4">
        <p className="font-semibold text-lg">Total: Rs. {total.toFixed(2)}</p>
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded mt-4"
          onClick={handleTransaction}
          disabled={!items.length}
        >
          Transaction Bill
        </button>
      </div>
    </div>
  );
};

export default TransactionBillCart;
