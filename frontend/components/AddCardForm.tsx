'use client';

import { useState, memo } from 'react';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddCardFormProps {
  onAdd: (title: string, details: string) => void;
}

function AddCardForm({ onAdd }: AddCardFormProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), details.trim());
      setTitle('');
      setDetails('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
        sx={{
          borderColor: '#209dd7',
          color: '#209dd7',
          borderStyle: 'dashed',
          '&:hover': {
            borderColor: '#1a7ba8',
            backgroundColor: 'rgba(32, 157, 215, 0.04)',
          },
        }}
      >
        Add Card
      </Button>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
        boxShadow: 1,
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        autoFocus
        sx={{ mb: 1.5 }}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        size="small"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Card details"
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#753991',
            '&:hover': { bgcolor: '#5d2d73' },
          }}
        >
          Add Card
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            setIsOpen(false);
            setTitle('');
            setDetails('');
          }}
          sx={{ color: '#888888', borderColor: '#e0e0e0' }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default memo(AddCardForm);
