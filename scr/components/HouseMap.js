import React, { useState, useEffect } from 'react';

const HouseMap = () => {
  const [houses, setHouses] = useState([]);
  const [notification, setNotification] = useState({
    name: '',
    houseNumber: '',
    departureDate: '',
    returnDate: '',
    message: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const streetData = [
      { name: 'Bunyu Raya', start: 231, end: 240 },
      { name: 'Kasim 1', start: 281, end: 290 },
      { name: 'Kasim 2', ranges: [{ start: 261, end: 270 }, { start: 271, end: 280 }] },
      { name: 'Kasim 3', ranges: [{ start: 241, end: 250 }, { start: 251, end: 260 }] }
    ];

    const initialHouses = streetData.flatMap(street => {
      if (street.ranges) {
        return street.ranges.flatMap(range => 
          Array.from({ length: range.end - range.start + 1 }, (_, i) => ({
            id: `${street.name}-${range.start + i}`,
            street: street.name,
            number: range.start + i,
            occupied: true
          }))
        );
      } else {
        return Array.from({ length: street.end - street.start + 1 }, (_, i) => ({
          id: `${street.name}-${street.start + i}`,
          street: street.name,
          number: street.start + i,
          occupied: true
        }));
      }
    });

    setHouses(initialHouses);
  }, []);

  const handleInputChange = (e) => {
    setNotification({
      ...notification,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedHouses = houses.map(house => {
      if (house.id === notification.houseNumber) {
        const currentDate = new Date();
        const departureDate = new Date(notification.departureDate);
        const returnDate = new Date(notification.returnDate);
        
        const occupied = !(currentDate >= departureDate && currentDate <= returnDate);
        
        return { ...house, occupied: occupied };
      }
      return house;
    });
    
    setHouses(updatedHouses);
    console.log('Notification submitted:', notification);
    // Don't reset the form here to allow for WhatsApp message sending
  };

  const sendWhatsAppMessage = () => {
    const selectedHouse = houses.find(house => house.id === notification.houseNumber);
    const message = `New notification from ${notification.name}:\nHouse: ${selectedHouse.street} St - ${selectedHouse.number}\nDeparture: ${notification.departureDate}\nReturn: ${notification.returnDate}\nMessage: ${notification.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${notification.phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');

    // Reset form after sending message
    setNotification({
      name: '',
      houseNumber: '',
      departureDate: '',
      returnDate: '',
      message: '',
      phoneNumber: ''
    });
  };

  const renderStreet = (streetName, houses) => (
    <div key={streetName}>
      <h2 style={{ marginBottom: '10px' }}>{streetName}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '5px' }}>
        {houses.map(house => (
          <div 
            key={house.id} 
            style={{
              padding: '5px',
              textAlign: 'center',
              backgroundColor: house.occupied ? '#90EE90' : '#FFB6C1',
              border: '1px solid #000',
              borderRadius: '5px'
            }}
          >
            {house.number}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Kasim & Bunyu Raya Neighborhood Map</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        {renderStreet('Bunyu Raya St', houses.filter(h => h.street === 'Bunyu Raya'))}
        {renderStreet('Kasim 1 St', houses.filter(h => h.street === 'Kasim 1'))}
        <div>
          <h2 style={{ marginBottom: '10px' }}>Kasim 2 St</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {renderStreet('', houses.filter(h => h.street === 'Kasim 2' && h.number >= 261 && h.number <= 270))}
            {renderStreet('', houses.filter(h => h.street === 'Kasim 2' && h.number >= 271 && h.number <= 280))}
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: '10px' }}>Kasim 3 St</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {renderStreet('', houses.filter(h => h.street === 'Kasim 3' && h.number >= 241 && h.number <= 250))}
            {renderStreet('', houses.filter(h => h.street === 'Kasim 3' && h.number >= 251 && h.number <= 260))}
          </div>
        </div>
      </div>
      
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Submit Notification</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          name="name"
          value={notification.name}
          onChange={handleInputChange}
          placeholder="Your Name"
          required
          style={{ padding: '5px' }}
        />
        <select
          name="houseNumber"
          value={notification.houseNumber}
          onChange={handleInputChange}
          required
          style={{ padding: '5px' }}
        >
          <option value="">Select Your House</option>
          {houses.map(house => (
            <option key={house.id} value={house.id}>
              {house.street} St - {house.number}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="departureDate"
          value={notification.departureDate}
          onChange={handleInputChange}
          required
          style={{ padding: '5px' }}
        />
        <input
          type="date"
          name="returnDate"
          value={notification.returnDate}
          onChange={handleInputChange}
          required
          style={{ padding: '5px' }}
        />
        <textarea
          name="message"
          value={notification.message}
          onChange={handleInputChange}
          placeholder="Any additional information for your neighbors..."
          style={{ padding: '5px', height: '100px' }}
        />
        <input
          type="tel"
          name="phoneNumber"
          value={notification.phoneNumber}
          onChange={handleInputChange}
          placeholder="WhatsApp Group Admin's Phone Number"
          required
          style={{ padding: '5px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>
          Submit Notification
        </button>
        <button 
          type="button" 
          onClick={sendWhatsAppMessage}
          style={{ padding: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Send WhatsApp Message
        </button>
      </form>
    </div>
  );
};

export default HouseMap;
