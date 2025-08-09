// Import utilities for admin data

export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        }).filter(row => Object.values(row).some(value => value !== ''));
        
        resolve(data);
      } catch {
        reject(new Error('Failed to parse CSV file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const validateBrandData = (data) => {
  const requiredFields = ['Brand Name', 'Category'];
  const errors = [];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePerfumeData = (data) => {
  const requiredFields = ['Perfume Name', 'Brand', 'Category'];
  const errors = [];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCategoryData = (data) => {
  const requiredFields = ['Category Name'];
  const errors = [];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const convertImportedBrandsToStructure = (importedData, existingCategories) => {
  return importedData.map(row => ({
    id: Date.now() + Math.random(), // Generate unique ID
    name: row['Brand Name'] || row['Brand Name'],
    description: row['Description'] || '',
    imageUrl: row['Image URL'] || '',
    categoryId: existingCategories.find(cat => 
      cat.name.toLowerCase() === (row['Category'] || '').toLowerCase()
    )?.id || null,
    perfumes: []
  }));
};

export const convertImportedPerfumesToStructure = (importedData, existingCategories) => {
  return importedData.map(row => ({
    id: Date.now() + Math.random(), // Generate unique ID
    name: row['Perfume Name'] || row['Perfume Name'],
    number: row['Perfume Number'] || '',
    brandId: null, // Will be set when processing
    categoryId: existingCategories.find(cat => 
      cat.name.toLowerCase() === (row['Category'] || '').toLowerCase()
    )?.id || null
  }));
};

export const convertImportedCategoriesToStructure = (importedData) => {
  return importedData.map(row => ({
    id: Date.now() + Math.random(), // Generate unique ID
    name: row['Category Name'] || row['Category Name'],
    description: row['Description'] || '',
    color: row['Color'] || 'blue',
    brands: []
  }));
};
