// Export utilities for admin data

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename) => {
  if (!data) {
    console.warn('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Convert data to worksheet format
  const headers = Object.keys(data[0]);
  const worksheet = [
    headers,
    ...data.map(row => headers.map(header => row[header]))
  ];

  // Create TSV content (Excel can open TSV files)
  const tsvContent = worksheet.map(row => row.join('\t')).join('\n');
  
  const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.tsv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const prepareBrandsForExport = (categories) => {
  return categories.reduce((acc, category) => {
    const brandsWithCategory = category.brands.map(brand => ({
      'Brand ID': brand.id,
      'Brand Name': brand.name,
      'Description': brand.description,
      'Category': category.name,
      'Category ID': category.id,
      'Perfume Count': brand.perfumes.length,
      'Image URL': brand.imageUrl || ''
    }));
    return [...acc, ...brandsWithCategory];
  }, []);
};

export const preparePerfumesForExport = (categories) => {
  return categories.reduce((acc, category) => {
    const perfumesWithContext = category.brands.reduce((brandAcc, brand) => {
      const perfumesWithBrand = brand.perfumes.map(perfume => ({
        'Perfume ID': perfume.id,
        'Perfume Name': perfume.name,
        'Perfume Number': perfume.number,
        'Brand': brand.name,
        'Brand ID': brand.id,
        'Category': category.name,
        'Category ID': category.id
      }));
      return [...brandAcc, ...perfumesWithBrand];
    }, []);
    return [...acc, ...perfumesWithContext];
  }, []);
};

export const prepareCategoriesForExport = (categories) => {
  return categories.map(category => ({
    'Category ID': category.id,
    'Category Name': category.name,
    'Description': category.description,
    'Color': category.color,
    'Brand Count': category.brands.length,
    'Total Perfumes': category.brands.reduce((acc, brand) => acc + brand.perfumes.length, 0)
  }));
};
