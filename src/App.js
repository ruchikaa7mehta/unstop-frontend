import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HotelReservation() {
  // State to store the number of rooms requested by the user
  const [numRooms, setNumRooms] = useState(1);

  // State to store the list of booked rooms
  const [bookings, setBookings] = useState([]);

  // State to store the list of all available rooms
  const [rooms, setRooms] = useState([]);

  // Loading state to handle UI during requests
  const [loading, setLoading] = useState(false);

  // Fetch available rooms from the backend
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/rooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle booking rooms
  const bookRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/book", {
        numRooms,
      });
      setBookings(response.data.bookedRooms);
      fetchRooms(); // Refresh rooms list after booking
    } catch (error) {
      console.error("Error booking rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate random occupancy for rooms
  const generateRandomOccupancy = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/randomize");
      fetchRooms();
    } catch (error) {
      console.error("Error generating random occupancy:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset all bookings
  const resetBookings = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/reset");
      fetchRooms();
      setBookings([]); // Reset the list of booked rooms
    } catch (error) {
      console.error("Error resetting bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Hotel Room Reservation</h1>

      {/* Number of Rooms input */}
      <div className="mb-6">
        <label className="block mb-2 text-lg">Number of Rooms to Book:</label>
        <input
          type="number"
          min="1"
          max="5"
          value={numRooms}
          onChange={(e) => setNumRooms(Number(e.target.value))}
          className="border border-gray-300 p-3 w-full rounded-lg"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={bookRooms}
          disabled={loading}
          className={`bg-blue-500 text-white px-6 py-3 rounded-lg ${loading && "opacity-50"}`}
        >
          {loading ? "Booking..." : "Book Rooms"}
        </button>
        <button
          onClick={generateRandomOccupancy}
          disabled={loading}
          className={`bg-green-500 text-white px-6 py-3 rounded-lg ${loading && "opacity-50"}`}
        >
          {loading ? "Generating..." : "Randomize Occupancy"}
        </button>
        <button
          onClick={resetBookings}
          disabled={loading}
          className={`bg-red-500 text-white px-6 py-3 rounded-lg ${loading && "opacity-50"}`}
        >
          {loading ? "Resetting..." : "Reset Bookings"}
        </button>
      </div>

      {/* Available Rooms Section */}
      <h2 className="text-2xl font-semibold mb-4">Available Rooms:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {rooms.map((room) => (
          <div
            key={room.room_number}
            className={`p-4 border rounded-lg text-center ${room.is_booked ? "bg-gray-300" : "bg-white"}`}
          >
            <span className={`font-semibold ${room.is_booked ? "text-gray-500" : "text-black"}`}>
              {room.room_number}
            </span>
          </div>
        ))}
      </div>

      {/* Booked Rooms Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-2">Bookings:</h2>
      <ul className="list-disc pl-6">
        {bookings.map((room) => (
          <li key={room} className="text-lg">
            Room {room}
          </li>
        ))}
      </ul>
    </div>
  );
}
