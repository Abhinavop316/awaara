import React, { useState, useEffect } from 'react';
import { ModalWrapper } from '../common/ModalWrapper';
import { CustomSelect } from '../common/CustomSelect';
import { useAdminData } from '../../context/AdminDataContext';

export const BusModal = ({ isOpen, onClose, busToEdit, showToast }) => {
  const { templates, addBus, updateBus } = useAdminData();

  const [formData, setFormData] = useState({
    busNumber: '',
    source: '',
    destination: '',
    departureTime: '20:00',
    arrivalTime: '08:00 (Next Day)',
    totalSeats: 40,
    acType: 'AC',
    boardingPointsText: 'Kashmere Gate ISBT, Majnu Ka Tilla',
    droppingPointsText: 'Mall Road, City Center',
    status: 'Active'
  });

  useEffect(() => {
    if (busToEdit) {
      setFormData({
        ...busToEdit,
        busNumber: busToEdit.busNumber || '',
        source: busToEdit.source || '',
        destination: busToEdit.destination || '',
        departureTime: busToEdit.departureTime || '20:00',
        arrivalTime: busToEdit.arrivalTime || '08:00 (Next Day)',
        totalSeats: busToEdit.totalSeats || 40,
        acType: busToEdit.acType || (busToEdit.name?.toLowerCase().includes('non-ac') ? 'Non-AC' : 'AC'),
        boardingPointsText: (busToEdit.boardingPoints || []).join(', '),
        droppingPointsText: (busToEdit.droppingPoints || []).join(', '),
        status: busToEdit.status || 'Active'
      });
    } else {
      setFormData({
        busNumber: '',
        source: 'Delhi',
        destination: 'Manali',
        departureTime: '20:00',
        arrivalTime: '08:00 (Next Day)',
        totalSeats: 40,
        acType: 'AC',
        boardingPointsText: 'Kashmere Gate ISBT, Majnu Ka Tilla',
        droppingPointsText: 'Mall Road, City Center',
        status: 'Active'
      });
    }
  }, [busToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.busNumber.trim() || !formData.source.trim() || !formData.destination.trim()) {
      alert('Please fill out Bus Number, Departure, and Destination.');
      return;
    }

    const payload = {
      ...formData,
      name: `${formData.busNumber.toUpperCase()} (${formData.acType})`,
      totalSeats: parseInt(formData.totalSeats) || 40,
      templateId: busToEdit?.templateId || templates[0]?.id || 'tpl-2-2-seater',
      boardingPoints: formData.boardingPointsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      droppingPoints: formData.droppingPointsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    };

    if (busToEdit) {
      updateBus(busToEdit.id, payload);
      showToast(`Bus ${formData.busNumber} updated!`);
    } else {
      addBus(payload);
      showToast(`New Bus ${formData.busNumber} registered!`);
    }

    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={busToEdit ? `Edit Bus: ${busToEdit.busNumber}` : 'Register New Bus'}
      subtitle="Configure bus number plate, route, schedule, seat capacity, AC type, and stop points"
      maxWidth="760px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-grid">
            {/* 1. Bus No. Plate */}
            <div className="form-group full">
              <label>Bus No. Plate (Registration Number) *</label>
              <input
                type="text"
                placeholder="e.g. DL 01 ABB1"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value.toUpperCase() })}
                required
              />
            </div>

            {/* 2. Departure / Source */}
            <div className="form-group">
              <label>Departure (Source) *</label>
              <input
                type="text"
                placeholder="e.g. Delhi"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>

            {/* 3. Destination */}
            <div className="form-group">
              <label>Destination *</label>
              <input
                type="text"
                placeholder="e.g. Manali"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>

            {/* 4. Departure Time */}
            <div className="form-group">
              <label>Departure Time</label>
              <input
                type="text"
                placeholder="e.g. 20:00"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              />
            </div>

            {/* 5. Arrival Time */}
            <div className="form-group">
              <label>Arrival Time</label>
              <input
                type="text"
                placeholder="e.g. 08:00 (Next Day)"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              />
            </div>

            {/* 6. No. of Seats */}
            <div className="form-group">
              <label>No. of Seats *</label>
              <input
                type="number"
                min="10"
                max="70"
                placeholder="e.g. 40"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                required
              />
            </div>

            {/* 7. AC / Non-AC */}
            <div className="form-group">
              <label>AC / Non-AC *</label>
              <CustomSelect
                value={formData.acType}
                onChange={(val) => setFormData({ ...formData, acType: val })}
                options={[
                  { value: 'AC', label: 'AC (Air Conditioned)', badge: 'Luxury' },
                  { value: 'Non-AC', label: 'Non-AC (Standard)', badge: 'Economy' }
                ]}
              />
            </div>

            {/* 8. Boarding Point */}
            <div className="form-group full">
              <label>Boarding Point (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Kashmere Gate ISBT, Majnu Ka Tilla"
                value={formData.boardingPointsText}
                onChange={(e) => setFormData({ ...formData, boardingPointsText: e.target.value })}
              />
            </div>

            {/* 9. Dropping Point */}
            <div className="form-group full">
              <label>Dropping Point (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Mall Road, City Center"
                value={formData.droppingPointsText}
                onChange={(e) => setFormData({ ...formData, droppingPointsText: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {busToEdit ? 'Save Bus Details' : 'Register Bus'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
