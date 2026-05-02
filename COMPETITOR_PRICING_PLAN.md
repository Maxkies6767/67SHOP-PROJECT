# แผนการพัฒนาระบบเปรียบเทียบราคาคู่แข่ง (Competitor Pricing Aggregator)

โปรเจกต์นี้แบ่งออกเป็น 3 Phase หลัก เพื่อสร้างระบบวิเคราะห์ราคา Real-time จาก 20+ แหล่งข้อมูล

## 🟢 Phase 2: High-Performance Backend Aggregator (ปัจจุบัน)
**เป้าหมาย:** พัฒนาระบบ API สำหรับดึงข้อมูลและจัดการ Cache
- [x] **Data Cleansing Engine**: ระบบ Normalization (เสร็จสิ้นจาก Phase 1)
- [ ] **Parallel Scraper**: พัฒนาระบบดึงข้อมูลพร้อมกันด้วย Puppeteer/Cheerio
- [ ] **Configurable Selectors**: ระบบจัดการ Selector แยกตาม Supplier
- [ ] **10-Min Cache Logic**: ระบบ Caching เพื่อลด Load และเพิ่มความเร็ว
- [ ] **API Endpoint**: GET /api/compare-prices

## ⚪ Phase 3: [รอรายละเอียดจาก USER]
- [ ] รอดำเนินการ...

## ⚪ Phase 3: [รอรายละเอียดจาก USER]
- [ ] รอดำเนินการ...

---
*บันทึกสถานะล่าสุด: 01/05/2026 14:52*
