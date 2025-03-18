function formatRupiah(value) {
  const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
  });
  return formatter.format(value);
}

function formatTime(dateString) {
  const date = new Date(dateString);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  // const seconds = String(date.getSeconds()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// function formatDate(stringDate) {
//   const date = new Date(stringDate);
    
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
//   const year = date.getFullYear();
  
//   return `${day} - ${month} - ${year}`; //return "01 - 09 - 2024"
// }

function formatDate(stringDate) {
  const date = new Date(stringDate);

  const daysInMonth = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const day = String(date.getDate()).padStart(2, '0');
  const monthIndex = date.getMonth();
  const monthName = daysInMonth[monthIndex];
  const year = date.getFullYear();

  return `${day} ${monthName} ${year}`; //return "01 September 2024"
}

function formatCustomerId(id) {
  // Pad id with leading zeros up to 5 digits
  const paddedId = String(id).padStart(5, '0');
  // Combine with prefix 'JJC'
  return `JJC${paddedId}`;
}

function getCurrentTime() {
  const currentDate = new Date();
  // Mengatur zona waktu ke GMT+7
  const localTime = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000);
  // Format Jam dan menit ke dalam format hh:mm
  const hours = localTime.getUTCHours().toString().padStart(2, '0');
  const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatWhatsappNumberLink(phone_number) {
  if (!phone_number) return '';
  return phone_number.replace(/^0/, '62');
}

export {
  formatRupiah,
  formatTime,
  formatDate,
  formatCustomerId,
  getCurrentTime,
  formatWhatsappNumberLink
}