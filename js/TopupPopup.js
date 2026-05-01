/**
 * TopupPopup Component (V4 - Official Theme)
 * Perfectly synced with 67SHOP official CSS variables and styling.
 */
function TopupPopup({ isOpen, onClose, game, packages = [], allSupplierPackages = [], onOrder }) {
function TopupPopup({ isOpen, onClose, game, packages = [], onOrder }) {
  const [selectedPkg, setSelectedPkg] = React.useState(null);
  const [uid, setUid] = React.useState('');
  const [profit, setProfit] = React.useState(0);
  const [bestSupplier, setBestSupplier] = React.useState(null);
  const [originalCost, setOriginalCost] = React.useState(0);

  // When a package is selected, find its cheapest supplier from the DB data
  React.useEffect(() => {
    if (selectedPkg) {
      const cheapest = Store.getCheapestSupplier(selectedPkg);
      if (cheapest) {
        setBestSupplier(cheapest.name);
        setOriginalCost(cheapest.cost);
        // Automatically calculate default profit if sellPrice is configured
        if (selectedPkg.sellPrice) {
            setProfit(selectedPkg.sellPrice - cheapest.cost);
        } else {
            setProfit(0);
        }
      } else {
        setBestSupplier('ไม่พบข้อมูล Supplier');
        setOriginalCost(0);
        setProfit(selectedPkg.sellPrice || 0);
      }
    }
  }, [selectedPkg]);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedPkg(null);
      setUid('');
      setBestSupplier(null);
      setOriginalCost(0);
      setProfit(0);
    }
  }, [game, isOpen]);

  const totalPrice = Number(originalCost) + Number(profit);

  if (!isOpen) return null;

  return React.createElement('div', {
    className: "fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300",
    onClick: (e) => e.target === e.currentTarget && onClose()
  }, 
    React.createElement('div', {
      className: "w-full max-w-4xl bg-[#0d0c12] border border-[#8b5cf6]/20 rounded-[22px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] animate-modal-pop",
      style: { borderTop: '4px solid #8b5cf6' }
    }, [
      // Header
      React.createElement('div', { className: "flex justify-between items-center p-6 border-b border-white/5 bg-[#151223]/80", key: 'header' }, [
        React.createElement('div', { className: "flex items-center gap-4", key: 'title-group' }, [
          game?.icon && React.createElement('img', { src: game.icon, className: "w-12 h-12 rounded-[14px] object-cover border border-[#8b5cf6]/30", key: 'icon' }),
          React.createElement('div', { key: 'text' }, [
            React.createElement('h2', { className: "text-xl font-black text-white leading-tight", key: 'title' }, game?.name || 'Top-up'),
            React.createElement('span', { className: "role-tag text-[10px]", key: 'tag' }, 'SYSTEM LOGIC ENABLED')
          ])
        ]),
        React.createElement('button', { 
          onClick: onClose, 
          className: "text-white/40 hover:text-white transition-colors p-2", 
          key: 'close' 
        }, '✕')
      ]),

      // Content
      React.createElement('div', { className: "flex-1 overflow-y-auto p-8 space-y-8", key: 'content' }, [
        
        // 3. เลือกแพ็กเกจ
        React.createElement('div', { className: "card", key: 'pkg-section' }, [
          React.createElement('div', { className: 'flex items-center gap-3 mb-6' }, [
            React.createElement('span', { className: 'role-tag' }, 'STEP 2'),
            React.createElement('h3', { className: 'text-sm font-bold text-white/60 uppercase tracking-widest' }, 'เลือกแพ็กเกจสินค้า')
          ]),
          React.createElement('div', { className: "pkg-grid" }, packages.length === 0 ? 
            React.createElement('p', { className: 'text-white/30 text-sm' }, 'ยังไม่มีแพ็กเกจสำหรับเกมนี้ (เพิ่มได้ที่ตั้งค่า)') : 
            packages.map(pkg => (
              React.createElement('div', {
                key: pkg.id,
                onClick: () => setSelectedPkg(pkg),
                className: `pkg-card ${selectedPkg?.id === pkg.id ? 'selected' : ''}`
              }, [
                  React.createElement('div', { className: "pkg-name" }, pkg.name),
                  React.createElement('div', { className: "pkg-price" }, `฿${pkg.sellPrice || 0}`)
              ])
          )))
        ]),

        // 4. สรุป & กรอก UID
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-8", key: 'summary-section' }, [
            // Left Column: UID Input
            React.createElement('div', { className: 'card', key: 'uid-card' }, [
                React.createElement('div', { className: 'flex items-center gap-3 mb-6' }, [
                    React.createElement('span', { className: 'role-tag' }, 'STEP 3'),
                    React.createElement('h3', { className: 'text-sm font-bold text-white/60 uppercase tracking-widest' }, 'ข้อมูลลูกค้า')
                ]),
                React.createElement('div', { className: 'form-group' }, [
                    React.createElement('label', { className: 'form-label' }, 'UID ลูกค้า'),
                    React.createElement('input', {
                        value: uid,
                        onChange: (e) => setUid(e.target.value),
                        placeholder: 'ระบุ UID ผู้เล่น...',
                        className: 'form-input'
                    })
                ]),
                React.createElement('div', { className: 'mt-4' }, [
                    React.createElement('label', { className: 'form-label' }, 'ราคาขายหน้าร้าน'),
                    React.createElement('div', { className: 'form-input bg-black/40 text-[#8b5cf6] font-black text-xl' }, 
                      totalPrice ? `฿ ${totalPrice.toLocaleString()}` : '-'
                    )
                ])
            ]),
            // Right Column: Admin Summary
            React.createElement('div', { className: 'card border-dashed', key: 'admin-card' }, [
                React.createElement('div', { className: 'flex items-center gap-3 mb-6' }, [
                    React.createElement('i', { className: 'fas fa-shield-alt text-[#8b5cf6]' }),
                    React.createElement('h3', { className: 'text-sm font-bold text-white/40 uppercase tracking-widest' }, 'ADMIN SUMMARY')
                ]),
                React.createElement('div', { className: 'space-y-4' }, [
                    React.createElement('div', { className: 'flex justify-between items-center text-xs' }, [
                        React.createElement('span', { className: 'text-white/30' }, 'Supplier (Lowest Cost):'),
                        React.createElement('span', { className: 'text-[#8b5cf6] font-bold' }, bestSupplier || 'Searching...')
                    ]),
                    React.createElement('div', { className: 'flex justify-between items-center text-xs' }, [
                        React.createElement('span', { className: 'text-white/30' }, 'Original Cost (Base):'),
                        React.createElement('span', { className: 'text-white/80 font-bold' }, originalCost ? `฿ ${originalCost}` : '-')
                    ]),
                    React.createElement('div', { className: 'pt-4 border-t border-white/5' }),
                    React.createElement('div', { className: 'flex justify-between items-center' }, [
                        React.createElement('span', { className: 'text-xs text-white/30 font-bold' }, 'SET PROFIT:'),
                        React.createElement('div', { className: 'flex items-center gap-2' }, [
                            React.createElement('span', { className: 'text-[#8b5cf6] font-bold' }, '฿'),
                            React.createElement('input', {
                                type: 'number',
                                value: profit,
                                onChange: (e) => setProfit(e.target.value),
                                className: 'bg-black/30 border border-[#8b5cf6]/20 rounded-lg px-2 py-1 text-right text-[#8b5cf6] font-bold w-20 focus:border-[#8b5cf6] outline-none'
                            })
                        ])
                    ])
                ])
            ])
        ])
      ]),

      // Action Button
      React.createElement('div', { className: "p-8 pt-0", key: 'footer' }, [
        React.createElement('button', {
          disabled: !selectedPkg || !uid,
          onClick: () => onOrder({ uid, profit, totalPrice, bestSupplier, originalCost, selectedPkg }),
          className: `btn btn-primary w-full py-4 text-xl font-black ${(!selectedPkg || !uid) ? 'opacity-20 cursor-not-allowed' : 'shadow-[0_0_30px_rgba(139,92,246,0.3)]'}`
        }, [
            React.createElement('i', { className: 'fas fa-paper-plane mr-3', key: 'icon' }),
            `ส่งออเดอร์ (฿${totalPrice})`
        ])
      ])
    ])
  );
}
