import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { SeatLayoutCanvas } from './SeatLayoutCanvas';
import { SeatEditorSidebar } from './SeatEditorSidebar';
import { LayoutTemplatePicker } from './LayoutTemplatePicker';
import { LayoutCustomizerControls } from './LayoutCustomizerControls';
import { renumberDeck, createEmptyDeck } from '../../utils/layoutHelpers';

export const SeatLayoutStudio = ({ showToast }) => {
  const { templates, saveTemplate } = useAdminData();

  // Active working layout in editor
  const [activeTemplate, setActiveTemplate] = useState(() => templates[0]);
  const [workingLayout, setWorkingLayout] = useState(() => JSON.parse(JSON.stringify(templates[0])));
  const [activeDeck, setActiveDeck] = useState('lower');
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    if (activeTemplate) {
      setWorkingLayout(JSON.parse(JSON.stringify(activeTemplate)));
      setSelectedCell(null);
      setActiveDeck('lower');
    }
  }, [activeTemplate]);

  const handleSelectTemplate = (tpl) => {
    setActiveTemplate(tpl);
  };

  const handleCreateBlank = () => {
    const newTpl = {
      id: `tpl-custom-${Date.now()}`,
      name: 'Custom 2+2 Layout',
      description: 'Newly created bus seating layout with ₹525 base pricing',
      type: 'seater',
      hasUpperDeck: false,
      rows: 11,
      cols: 5,
      decks: {
        lower: createEmptyDeck(11, 5, 525),
        upper: []
      }
    };
    setActiveTemplate(newTpl);
    setWorkingLayout(newTpl);
    showToast('Created new layout template!');
  };

  const handleUpdateCell = (deck, r, c, updatedCell) => {
    setWorkingLayout((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const targetDeck = deck === 'upper' ? copy.decks.upper : copy.decks.lower;
      if (targetDeck && targetDeck[r] && targetDeck[r][c]) {
        targetDeck[r][c] = updatedCell;
      }
      return copy;
    });

    // Update selected cell view
    setSelectedCell({ deck, r, c, data: updatedCell });
  };

  const handleUpdateLayoutMeta = (field, value) => {
    setWorkingLayout((prev) => {
      const copy = { ...prev, [field]: value };

      // If dimensions change, adjust grid
      if (field === 'rows' || field === 'cols') {
        const rows = field === 'rows' ? value : copy.rows;
        const cols = field === 'cols' ? value : copy.cols;
        copy.decks.lower = adjustGridDimensions(copy.decks.lower, rows, cols, 'L');
        if (copy.hasUpperDeck) {
          copy.decks.upper = adjustGridDimensions(copy.decks.upper || [], rows, cols, 'U');
        }
      }

      if (field === 'hasUpperDeck' && value && (!copy.decks.upper || copy.decks.upper.length === 0)) {
        copy.decks.upper = createEmptyDeck(copy.rows, copy.cols, 525);
      }

      return copy;
    });
  };

  function adjustGridDimensions(grid, targetRows, targetCols, prefix) {
    const current = Array.isArray(grid) ? grid : [];
    const newGrid = [];

    for (let r = 0; r < targetRows; r++) {
      const row = [];
      for (let c = 0; c < targetCols; c++) {
        if (current[r] && current[r][c]) {
          row.push(current[r][c]);
        } else {
          const isAisle = targetCols === 5 ? c === 2 : targetCols === 4 ? c === 1 : false;
          row.push({
            id: `cell-${r}-${c}`,
            type: isAisle ? 'empty' : 'seater',
            seatNumber: isAisle ? '' : `${prefix}${r * targetCols + c + 1}`,
            price: 525,
            priceModifier: 0,
            status: 'available',
            isAisle: isAisle
          });
        }
      }
      newGrid.push(row);
    }
    return newGrid;
  }

  const handleToggleBackRowFive = () => {
    setWorkingLayout((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const targetDeck = activeDeck === 'upper' ? copy.decks.upper : copy.decks.lower;
      if (targetDeck && targetDeck.length > 0) {
        const lastRowIdx = targetDeck.length - 1;
        const lastRow = targetDeck[lastRowIdx];
        lastRow.forEach((cell, cIdx) => {
          if (cell.type === 'empty') {
            cell.type = 'seater';
            cell.status = 'available';
            cell.price = 525;
            cell.seatNumber = `${activeDeck === 'upper' ? 'U' : 'L'}-Back${cIdx + 1}`;
          }
        });
      }
      return copy;
    });
    showToast('Back row converted to full 5-seat row!');
  };

  const handleRandomizeSold = () => {
    setWorkingLayout((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const randomizeDeck = (deck) => {
        if (!Array.isArray(deck)) return;
        deck.forEach((row) => {
          row.forEach((cell) => {
            if (cell.type === 'seater' || cell.type === 'sleeper') {
              // 25% chance of sold/booked
              const rand = Math.random();
              if (rand < 0.25) {
                cell.status = 'booked';
              } else if (rand < 0.3) {
                cell.status = 'female';
              } else {
                cell.status = 'available';
              }
            }
          });
        });
      };

      randomizeDeck(copy.decks.lower);
      if (copy.hasUpperDeck && copy.decks.upper) {
        randomizeDeck(copy.decks.upper);
      }
      return copy;
    });
    showToast('Sample sold/available distribution generated!');
  };

  const handleAutoRenumber = () => {
    setWorkingLayout((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.decks.lower = renumberDeck(copy.decks.lower, 'L');
      if (copy.hasUpperDeck && copy.decks.upper) {
        copy.decks.upper = renumberDeck(copy.decks.upper, 'U');
      }
      return copy;
    });
    showToast('Seats re-numbered successfully!');
  };

  const handleSave = () => {
    saveTemplate(workingLayout);
    setActiveTemplate(workingLayout);
    showToast(`Template "${workingLayout.name}" saved!`);
  };

  const handleReset = () => {
    setWorkingLayout(JSON.parse(JSON.stringify(activeTemplate)));
    setSelectedCell(null);
    showToast('Changes discarded.');
  };

  return (
    <div>
      {/* Template Picker */}
      <LayoutTemplatePicker
        templates={templates}
        activeTemplateId={workingLayout.id}
        onSelectTemplate={handleSelectTemplate}
        onCreateNewTemplate={handleCreateBlank}
      />

      {/* Main Layout Studio */}
      <div className="layout-studio-grid">
        {/* Visual Cabin Canvas */}
        <div>
          <SeatLayoutCanvas
            layout={workingLayout}
            activeDeck={activeDeck}
            setActiveDeck={setActiveDeck}
            selectedCell={selectedCell}
            onSelectCell={setSelectedCell}
          />
        </div>

        {/* Right Sidebar Inspector & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SeatEditorSidebar
            selectedCell={selectedCell}
            onUpdateCell={handleUpdateCell}
            onClearSelection={() => setSelectedCell(null)}
          />

          <LayoutCustomizerControls
            layout={workingLayout}
            onUpdateLayoutMeta={handleUpdateLayoutMeta}
            onAutoRenumber={handleAutoRenumber}
            onToggleBackRowFive={handleToggleBackRowFive}
            onRandomizeSold={handleRandomizeSold}
            onSaveTemplate={handleSave}
            onResetLayout={handleReset}
          />
        </div>
      </div>
    </div>
  );
};
