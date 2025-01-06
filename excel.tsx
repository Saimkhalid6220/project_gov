const ExcelComponent = () => {
    return (
      <div ref={topRef} className="min-h-screen bg-white text-black p-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold border-b border-r">SR. NO</th>
              {headers.map((header, index) => (
                <th key={index} className="py-3 px-4 text-left font-semibold border-b border-r">{header.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((row, rowIndex) => (
              <tr key={rowIndex} className={getRowClass(row.date_of_hearing)}>
                <td className="py-3 px-4 border-r">{rowIndex + 1}</td>
                {headers.map((header, index) => (
                  <td key={index} className="py-3 px-4 border-b border-r">{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  