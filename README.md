# BloodPressureTracker

* เพื่อบันทึกความดันโลหิตไว้แสดงให้แพทย์ดู
* ใช้ Ang v.18.0.1
* PrimeNG, PrimeIcons
* PrimeFlex
* angular/fire

- การตั้งค่า app.config.ts
- อย่าเอา compat มาปนกับ @angular/fire
- จะผิดพลาด No provider NullInjection
- มีปัญหาปรึกษา Copilot ได้
- ระวัง web storm จะ import อัตโนมัติ แล้วเกิด error
- เขาเป็น IDE สุดโปรด แต่บางครั้งฉลาดเกินไป :)
- "html2canvas": "^1.4.1",
  "jspdf": "^2.5.2",
- เพื่อแปลงเป็น img แล้วแปลงเป็น pdf เพื่อพิมพ์ 
