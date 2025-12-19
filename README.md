# Secure Decentralized Voting

**Trường Đại học Sư phạm Kỹ thuật TP. Hồ Chí Minh**

**Khoa Công nghệ thông tin** 

**Giảng viên hướng dẫn:** TS. Huỳnh Xuân Phụng

**Nhóm thực hiện:** Nhóm 6

---

## Thành viên nhóm

| MSSV        | Họ tên                  |
| :---------- | :---------------------- |
| **2591302** | **Nguyễn Thanh Bình**   |
| **2591303** | **Huỳnh Đình Hiệp**     |
| **2591311** | **Lê Nguyễn Tuấn Kiệt** |
| **2591322** | **Trần Minh Sang**      |

---

# 🗳️ Hệ thống Bầu cử Phi tập trung (Local DApp)

Ứng dụng bầu cử chạy trên Blockchain, được thiết kế để **chạy hoàn toàn trên Localhost** bằng Hardhat.  

---

## 🚀 Tính năng

- **Blockchain-based**: Phiếu bầu được lưu trữ minh bạch trên Hardhat Local
- **Role-based Access Control**:
  - Admin: cấp quyền voter, mở/đóng bầu cử
  - User: tham gia bỏ phiếu
- **Voting Window**: Thiết lập thời gian bắt đầu / kết thúc bầu cử
- **Real-time Countdown**: Đồng hồ đếm ngược tự động đổi trạng thái
- **Thông báo lỗi tiếng Việt** khi vi phạm luật bầu cử

---

## 🛠️ Công nghệ sử dụng

- Smart Contract: **Solidity**
- Blockchain Dev: **Hardhat**
- Web3: **Ethers.js v6**
- Frontend: **HTML, CSS, Vanilla JavaScript**

---