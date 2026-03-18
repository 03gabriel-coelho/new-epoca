export const DEFAULT_ZIP_CODE = '32150-240';

export const formatZipCode = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length !== 8) {
    return '';
  }

  return digits.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

export const formatPartialZipCode = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) {
    return digits;
  }

  return digits.replace(/^(\d{5})(\d)/, '$1-$2');
};

export const resolveZipCodeFromCity = async (city: string, stateCode?: string) => {
  const query = encodeURIComponent(`${city}${stateCode ? `, ${stateCode}` : ''}, Brasil`);
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${query}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao consultar CEP pela cidade.');
  }

  const data = await response.json();
  const place = Array.isArray(data) ? data[0] : null;

  if (!place?.lat || !place?.lon) {
    throw new Error('Cidade nao encontrada para consulta de CEP.');
  }

  const reverseResponse = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${place.lat}&lon=${place.lon}&addressdetails=1`,
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!reverseResponse.ok) {
    throw new Error('Falha ao consultar CEP da cidade encontrada.');
  }

  const reverseData = await reverseResponse.json();
  const zipCode = formatZipCode(reverseData?.address?.postcode || '');

  if (!zipCode) {
    throw new Error('CEP nao encontrado para a cidade informada.');
  }

  return zipCode;
};

export const resolveZipCodeFromIp = async () => {
  const response = await fetch('https://ipapi.co/json/', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao consultar localizacao por IP.');
  }

  const data = await response.json();
  const postalCode = formatZipCode(data?.postal || '');

  if (postalCode) {
    return postalCode;
  }

  if (!data?.city) {
    throw new Error('Cidade nao encontrada na consulta por IP.');
  }

  return resolveZipCodeFromCity(data.city, data.region_code);
};
