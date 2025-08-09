import { useState } from "react";

interface FieldErrors {
  [key: string]: string;
}

export function usePurchaseForm() {
  const [buyerName, setBuyerName] = useState("");
  const [buyerLastName, setBuyerLastName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerDni, setBuyerDni] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors };

    switch (field) {
      case "buyerName":
        if (!value.trim()) errors.buyerName = "El nombre es obligatorio";
        else if (value.length < 2)
          errors.buyerName = "El nombre debe tener al menos 2 caracteres";
        else delete errors.buyerName;
        break;
      case "buyerLastName":
        if (!value.trim()) errors.buyerLastName = "El apellido es obligatorio";
        else if (value.length < 2)
          errors.buyerLastName = "El apellido debe tener al menos 2 caracteres";
        else delete errors.buyerLastName;
        break;
      case "buyerEmail": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) errors.buyerEmail = "El email es obligatorio";
        else if (!emailRegex.test(value))
          errors.buyerEmail = "Ingresa un email válido";
        else delete errors.buyerEmail;
        break;
      }
      case "buyerDni":
        if (!value.trim()) errors.buyerDni = "El DNI es obligatorio";
        else if (!/^\d{7,8}$/.test(value))
          errors.buyerDni = "El DNI debe tener 7 u 8 dígitos";
        else delete errors.buyerDni;
        break;
      case "buyerPhone":
        if (value && !/^\d{8,15}$/.test(value.replace(/\s+/g, ""))) {
          errors.buyerPhone = "Ingresa un teléfono válido (8 a 15 dígitos)";
        } else delete errors.buyerPhone;
        break;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0; // Return if there are no errors
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "buyerName":
        setBuyerName(value);
        break;
      case "buyerLastName":
        setBuyerLastName(value);
        break;
      case "buyerEmail":
        setBuyerEmail(value);
        break;
      case "buyerPhone":
        setBuyerPhone(value);
        break;
      case "buyerDni":
        setBuyerDni(value);
        break;
    }
    validateField(field, value);
  };

  const validateAllFields = () => {
    const errors: FieldErrors = {};
    validateField("buyerName", buyerName);
    validateField("buyerLastName", buyerLastName);
    validateField("buyerEmail", buyerEmail);
    validateField("buyerDni", buyerDni);
    if (buyerPhone) validateField("buyerPhone", buyerPhone);

    setFieldErrors((prevErrors) => ({ ...prevErrors, ...errors })); // Merge any new errors
    return (
      Object.keys(errors).length === 0 &&
      buyerName &&
      buyerLastName &&
      buyerEmail &&
      buyerDni
    );
  };

  const resetForm = () => {
    setBuyerName("");
    setBuyerLastName("");
    setBuyerEmail("");
    setBuyerPhone("");
    setBuyerDni("");
    setQuantity(1);
    setFieldErrors({});
  };

  return {
    buyerName,
    setBuyerName,
    buyerLastName,
    setBuyerLastName,
    buyerEmail,
    setBuyerEmail,
    buyerPhone,
    setBuyerPhone,
    buyerDni,
    setBuyerDni,
    quantity,
    setQuantity,
    fieldErrors,
    setFieldErrors,
    handleInputChange,
    validateField,
    validateAllFields,
    resetForm,
  };
}
