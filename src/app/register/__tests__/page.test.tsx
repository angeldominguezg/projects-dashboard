import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../page';

// Mock de supabase
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn()
    }
  }
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('renderiza el formulario de registro correctamente', () => {
    render(<RegisterPage />);
    
    // Verificar que todos los elementos del formulario estén presentes
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  it('muestra errores de validación cuando los campos están vacíos', async () => {
    render(<RegisterPage />);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    // Intentar enviar el formulario vacío
    fireEvent.click(submitButton);

    // Verificar mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('muestra error cuando las contraseñas no coinciden', async () => {
    render(<RegisterPage />);
    
    // Llenar el formulario con contraseñas diferentes
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password456');

    // Verificar mensaje de error de contraseñas no coincidentes
    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  describe('proceso de registro', () => {
    let mockSignUp: jest.Mock;

    beforeEach(() => {
      // Configurar el mock antes de cada test
      mockSignUp = jest.fn();
      const { supabase } = require('@/lib/supabaseClient');
      supabase.auth.signUp = mockSignUp;
    });

    async function fillRegistrationForm() {
      await userEvent.type(screen.getByLabelText(/nombre/i), 'Usuario Test');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    }

    it('maneja diferentes escenarios de registro', async () => {
      // Primer intento: registro exitoso
      mockSignUp.mockResolvedValueOnce({
        data: { user: { id: '123' } },
        error: null
      });

      render(<RegisterPage />);
      await fillRegistrationForm();

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          options: {
            data: {
              displayName: 'Usuario Test'
            }
          }
        });
      });

      // Simular un segundo intento inmediato (debería fallar por rate limiting)
      mockSignUp.mockResolvedValueOnce({
        data: null,
        error: {
          status: 429,
          message: 'Too many requests. Please wait a while before trying again.'
        }
      });

      // Limpiar el formulario y volver a intentar
      await userEvent.clear(screen.getByLabelText(/nombre/i));
      await userEvent.clear(screen.getByLabelText(/email/i));
      await userEvent.clear(screen.getByLabelText(/^contraseña$/i));
      await userEvent.clear(screen.getByLabelText(/confirmar contraseña/i));
      await fillRegistrationForm();

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error al registrar el usuario/i)).toBeInTheDocument();
      });

      // Verificar que el mensaje de error específico se muestra
      expect(screen.getByText(/error al registrar el usuario/i)).toBeInTheDocument();
    });

    it('maneja errores generales del servidor', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: null,
        error: new Error('Error interno del servidor')
      });

      render(<RegisterPage />);
      await fillRegistrationForm();

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error al registrar el usuario/i)).toBeInTheDocument();
      });
    });
  });
});
