// app/utils/helpers.tsx

const convertDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const generateGoogleMapsUrl = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

const getStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const starStyle = {
    color: 'gold',
    fontSize: '1rem',
  };

  const starEmptyStyle = {
    color: 'lightgray',
    fontSize: '1rem',
  };

  return (
    <>
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <span key={`full-${index}`} style={starStyle}>&#9733;</span> // filled star
        ))}
      {Array(halfStars)
        .fill(0)
        .map((_, index) => (
          <span key={`half-${index}`} style={starStyle}>&#9733;</span> // half-filled star
        ))}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <span key={`empty-${index}`} style={starEmptyStyle}>&#9733;</span> // empty star
        ))}
    </>
  );
};

export { convertDate, generateGoogleMapsUrl, getStars };