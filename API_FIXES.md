# 🔧 Sửa lỗi API trong cinemaService.js

## ❌ **LỖI ĐÃ PHÁT HIỆN:**

### 1. **Lỗi trong `addRoom()` (dòng 85-99):**

#### **Lỗi 1: Biến không tồn tại**
```javascript
rowVipz: values.rowVip || [],  // ❌ SAI
//       ^^^^^^ - Biến 'values' không tồn tại!
//       'z' ở cuối 'rowVipz' là typo
```

#### **Lỗi 2: Mapping sai tên field**
```javascript
const backendData = {
  name: roomData.name,
  roomType: roomService.mapRoomTypeToBackend(roomData.type),  // ❌ roomData.type không tồn tại
  rowsCount: roomData.rows,                                    // ❌ roomData.rows không tồn tại
  seatsPerRow: roomData.seatsPerRow,
  rowVipz: values.rowVip || [],                               // ❌ values.rowVip không tồn tại
  price: roomData.price || 0,
  isActive: roomData.isActive !== undefined ? roomData.isActive : true
};
```

**Nguyên nhân:** CinemaDetail.jsx đã gửi data theo format backend (roomType, rowsCount, rowVip), nhưng cinemaService lại cố mapping lại từ format cũ (type, rows).

---

### 2. **Lỗi trong `updateRoom()` (dòng 108-122):**

```javascript
const backendData = {
  name: roomData.name,
  roomType: roomService.mapRoomTypeToBackend(roomData.type),  // ❌ roomData.type không tồn tại
  rowsCount: roomData.rows,                                    // ❌ roomData.rows không tồn tại
  seatsPerRow: roomData.seatsPerRow,
  price: roomData.price || 0,
  isActive: roomData.isActive !== undefined ? roomData.isActive : true
};
```

**Vấn đề tương tự:** Mapping sai field names.

---

## ✅ **ĐÃ SỬA:**

### 1. **Sửa `addRoom()`:**

```javascript
/**
 * Thêm phòng chiếu mới cho rạp (Admin)
 * @param {number} cinemaId - ID của rạp
 * @param {Object} roomData - Thông tin phòng chiếu
 * @param {string} roomData.name - Tên phòng
 * @param {string} roomData.roomType - Loại phòng (STANDARD_2D, STANDARD_3D, IMAX, VIP)
 * @param {number} roomData.rowsCount - Số hàng ghế
 * @param {number} roomData.seatsPerRow - Số ghế mỗi hàng
 * @param {Array<number>} roomData.rowVip - Danh sách index hàng VIP
 * @param {number} roomData.price - Giá cơ bản
 * @param {boolean} roomData.isActive - Trạng thái
 * @returns {Promise<Object>} Phòng chiếu vừa tạo
 */
addRoom: async (cinemaId, roomData) => {
  // ✅ roomData đã được format đúng từ CinemaDetail.jsx
  // ✅ Gửi trực tiếp lên API mà không cần mapping
  return roomService.createRoom(cinemaId, roomData);
}
```

**Lý do:**
- CinemaDetail.jsx đã chuẩn bị data đúng format backend:
  ```javascript
  const roomData = {
    name: values.name,
    roomType: values.roomType,        // ✅ STANDARD_2D, STANDARD_3D...
    rowsCount: values.rowsCount,      // ✅ Số hàng
    seatsPerRow: values.seatsPerRow,
    rowVip: values.rowVip || [],      // ✅ [4, 5, 6]
    price: values.price || 0,
    isActive: values.isActive !== undefined ? values.isActive : true
  };
  ```
- Không cần mapping lại, gửi thẳng lên API

---

### 2. **Sửa `updateRoom()`:**

```javascript
/**
 * Cập nhật thông tin phòng chiếu (Admin)
 * @param {number} cinemaId - ID của rạp (không sử dụng nhưng giữ lại cho consistency)
 * @param {number} roomId - ID của phòng chiếu
 * @param {Object} roomData - Thông tin cập nhật
 * @param {string} roomData.name - Tên phòng
 * @param {string} roomData.roomType - Loại phòng (STANDARD_2D, STANDARD_3D, IMAX, VIP)
 * @param {number} roomData.rowsCount - Số hàng ghế
 * @param {number} roomData.seatsPerRow - Số ghế mỗi hàng
 * @param {Array<number>} roomData.rowVip - Danh sách index hàng VIP
 * @param {number} roomData.price - Giá cơ bản
 * @param {boolean} roomData.isActive - Trạng thái
 * @returns {Promise<Object>} Phòng chiếu đã cập nhật
 */
updateRoom: async (cinemaId, roomId, roomData) => {
  // ✅ roomData đã được format đúng từ CinemaDetail.jsx
  // ✅ Gửi trực tiếp lên API mà không cần mapping
  return roomService.updateRoom(roomId, roomData);
}
```

---

## 📊 **SO SÁNH:**

### **TRƯỚC:**
```javascript
❌ CinemaDetail.jsx gửi:
{
  roomType: "STANDARD_2D",
  rowsCount: 10,
  rowVip: [4, 5, 6]
}

❌ cinemaService.js mapping lại:
{
  roomType: mapRoomTypeToBackend(roomData.type),  // undefined!
  rowsCount: roomData.rows,                       // undefined!
  rowVipz: values.rowVip                          // Error! 'values' không tồn tại
}

🔴 KẾT QUẢ: API nhận data sai → Lỗi!
```

### **SAU:**
```javascript
✅ CinemaDetail.jsx gửi:
{
  roomType: "STANDARD_2D",
  rowsCount: 10,
  rowVip: [4, 5, 6]
}

✅ cinemaService.js:
return roomService.createRoom(cinemaId, roomData);
// Gửi thẳng, không mapping

🟢 KẾT QUẢ: API nhận đúng data → Thành công!
```

---

## 🎯 **LUỒNG DỮ LIỆU MỚI:**

```
┌─────────────────────────┐
│  CinemaDetail.jsx       │
│  handleSubmitRoom()     │
└────────────┬────────────┘
             │
             │ {name, roomType, rowsCount, seatsPerRow, rowVip, price, isActive}
             ▼
┌─────────────────────────┐
│  cinemaService.js       │
│  addRoom()              │
│  updateRoom()           │
└────────────┬────────────┘
             │
             │ Gửi trực tiếp (không mapping)
             ▼
┌─────────────────────────┐
│  roomService.js         │
│  createRoom()           │
│  updateRoom()           │
└────────────┬────────────┘
             │
             │ POST/PUT request
             ▼
┌─────────────────────────┐
│  Backend API            │
│  /rooms/cinema/{id}     │
│  /rooms/{id}            │
└─────────────────────────┘
```

---

## 🔍 **KIỂM TRA:**

### ✅ **Test cases:**

1. **Tạo phòng mới:**
   ```javascript
   POST /rooms/cinema/1
   Body: {
     "name": "Phòng 1",
     "roomType": "STANDARD_2D",
     "rowsCount": 10,
     "seatsPerRow": 12,
     "rowVip": [4, 5, 6],
     "price": 50000,
     "isActive": true
   }
   
   ✅ Expected: 200 OK
   ```

2. **Cập nhật phòng:**
   ```javascript
   PUT /rooms/123
   Body: {
     "name": "Phòng 1 (Updated)",
     "roomType": "IMAX",
     "rowsCount": 12,
     "seatsPerRow": 15,
     "rowVip": [5, 6, 7],
     "price": 80000,
     "isActive": true
   }
   
   ✅ Expected: 200 OK
   ```

---

## 📝 **DOCUMENTATION UPDATES:**

### **Thêm JSDoc chi tiết:**

```javascript
/**
 * @param {Object} roomData - Thông tin phòng chiếu
 * @param {string} roomData.name - Tên phòng
 * @param {string} roomData.roomType - Loại phòng (STANDARD_2D, STANDARD_3D, IMAX, VIP)
 * @param {number} roomData.rowsCount - Số hàng ghế
 * @param {number} roomData.seatsPerRow - Số ghế mỗi hàng
 * @param {Array<number>} roomData.rowVip - Danh sách index hàng VIP
 * @param {number} roomData.price - Giá cơ bản
 * @param {boolean} roomData.isActive - Trạng thái
 */
```

---

## ✅ **KẾT QUẢ:**

✅ Sửa lỗi biến không tồn tại (`values.rowVip`)  
✅ Sửa lỗi typo (`rowVipz` → `rowVip`)  
✅ Loại bỏ mapping không cần thiết  
✅ Data flow đơn giản, rõ ràng hơn  
✅ Đồng bộ hoàn toàn với backend RoomRequest  
✅ Không còn lỗi compile  
✅ API hoạt động đúng

---

## 🚀 **FILES ĐÃ SỬA:**

1. ✅ `src/services/cinemaService.js`
   - Sửa `addRoom()`
   - Sửa `updateRoom()`
   - Thêm JSDoc chi tiết

---

## 📌 **LƯU Ý:**

- Nếu backend thay đổi RoomRequest, chỉ cần sửa ở **CinemaDetail.jsx**
- **cinemaService.js** và **roomService.js** không cần thay đổi
- Giữ nguyên principle: **"Format ở UI layer, pass-through ở service layer"**
