function postedAt(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) {
    return 'baru saja';
  }
  if (diffMin < 60) {
    return `${diffMin} menit lalu`;
  }
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${diffHour} jam lalu`;
  }
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) {
    return `${diffDay} hari lalu`;
  }
  return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default postedAt;
