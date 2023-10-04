// Class for modEnt Item
class modelEntity {
  constructor(data) {
    this.id = this.generateIdFromText(data.submenuText);
    this.submenuText = data.submenuText;
    this.submenuIconStart = data.submenuIconStart;
    this.submenuTemplate = data.submenuTemplate;
    this.mapSidebarItems = (data.mapSidebarItems || []).map(item => new MapSidebarItem(item));
    this.textFile = data.textFile;
    this.pngFile = data.pngFile;
    this.chartData = data.chartData;
    this.showLayers = data.showLayers || [];
  }

  generateIdFromText(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  createModelEntityElement() {
    const modelEntity = document.createElement('calcite-menu-item');
    modelEntity.setAttribute('id', this.id);
    modelEntity.setAttribute('text', this.submenuText);
    modelEntity.setAttribute('icon-start', this.submenuIconStart);
    modelEntity.setAttribute('text-enabled', '');

    const modelEntityInstance = this;

    modelEntity.addEventListener('click', function() {
      let mainSidebarItems2 = document.querySelectorAll('calcite-menu-item');
      mainSidebarItems2.forEach(item2 => {
        if(item2.text === modelEntityInstance.menuText) {  // Use the saved instance context here
          item2.active = true;
        } else {
          item2.active = false;
        }
      });

      // Show corresponding template
      const allTemplates = document.querySelectorAll('.template');
      allTemplates.forEach(template => template.hidden = true);
  
      // Show the selected template
      const selectedTemplate = document.getElementById(modelEntityInstance.submenuTemplate + 'Template');
      if (selectedTemplate) {
        selectedTemplate.hidden = false;
        // ... (Any additional specific logic for the template type)
      }
      const sidebarSelect = modelEntityInstance.getSidebarSelector(modelEntityInstance.submenuTemplate)
      modelEntityInstance.populateSidebar(sidebarSelect);  // Use the saved instance context here as well
      modelEntityInstance.populateText();
      //modelEntityInstance.populateImage();
      modelEntityInstance.displayJSONData();
      modelEntityInstance.createAvmtChart();
      modelEntityInstance.updateLayerVisibility();
      //modelEntityInstance.populateMainContent(modelEntityInstance.templateContent);


    });
    return modelEntity;
  }
  
  updateLayerVisibility() {
    // Loop through each layer in the map
    map.layers.forEach(layer => {
      // Check if the layer's id (or name, or other unique identifier) is in the showLayers list
      if (this.showLayers.includes(layer.title)) {
        // Show the layer if it's in the list
        layer.visible = true;
      } else {
        // Hide the layer if it's not in the list
        layer.visible = false;
      }
    });
  }

  populateSidebar(sidebarSelect) {

    const container = document.createElement('div');
    
    const titleEl = document.createElement('h2');
    titleEl.textContent = this.title;

    const sidebarContainer = document.createElement('div');
    this.mapSidebarItems.forEach(mapSidebarItem => {
      sidebarContainer.appendChild(mapSidebarItem.render());
    });

    container.appendChild(titleEl);
    container.appendChild(sidebarContainer);
    
    const sidebar = document.querySelector(sidebarSelect);
    // You might have to modify the next line based on the structure of your SidebarContent class.
    sidebar.innerHTML = ''; // clear existing content
    sidebar.appendChild(container);
    // Set the focus to the sidebar
    sidebar.focus();

  }

  populateText(){
    
    // Specify the file path
    const filePath = this.textFile;

    if (typeof filePath==='undefined') return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const fileContents = e.target.result;
        const fileContentsElement = document.getElementById("fileContents");
        if (fileContentsElement) {
            fileContentsElement.textContent = fileContents;
        }
    };
    fetch(filePath)
        .then(response => response.blob())
        .then(blob => {
            reader.readAsText(blob);
        })
        .catch(error => {
            console.error("Error reading file:", error);
        });
  }

  populateImage() {
    // Specify the file path
    const imagePath = this.pngFile;

    if (typeof imagePath==='undefined') return;

    fetch(imagePath)
        .then(response => {
            return response.blob();
        })
        .then(blob => {
            const imageURL = URL.createObjectURL(blob); // Create a URL for the blob
            const imgHTML = `<img src="${imageURL}" alt="Image Placeholder">`;

            const imageElement = document.getElementById("imageElement");
            if (imageElement) {
                imageElement.innerHTML = imgHTML; // Set the HTML content
            }
        })
        .catch(error => {
            console.error("Error fetching or displaying image:", error);
        });
  }

  // Function to create and populate the table
  displayJSONData() {
    const jsonData = {
      "data": [
        [0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123],
        [0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456],
        [0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789],
        [0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321],
        [0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654],
        [0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987],
        [0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135],
        [0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468],
        [0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791],
        [0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123],
        [0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456],
        [0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789],
        [0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321],
        [0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654],
        [0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987],
        [0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135],
        [0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468],
        [0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791],
        [0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123, 0.456, 0.789, 0.321, 0.654, 0.987, 0.135, 0.468, 0.791, 0.123]
      ]
    }

    const table = document.getElementById('matrixTable');
    table.innerHTML = '';
    
    // Create the header row for columns on row 1
    const headerRow = table.insertRow(0); // Insert at row 0
    headerRow.classList.add('header-row');

    // Create an empty cell for the row header column
    headerRow.insertCell();

    // Loop to create column headers with numbers
    for (let col = 0; col < jsonData.data[0].length; col++) {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = `j ${col + 1}`; // Column numbers start from 1
    }

    // Loop through the rows and columns of the JSON data
    for (let rowIndex = 0; rowIndex < jsonData.data.length; rowIndex++) {
        const row = jsonData.data[rowIndex];
        const newRow = table.insertRow();

        // Create the cell in the first column for the row header
        const rowHeaderCell = newRow.insertCell();
        rowHeaderCell.textContent = `i ${rowIndex + 1}`; // Row numbers start from 1
        rowHeaderCell.classList.add('row-header'); // Apply the row header style

        // Loop through the data cells for this row, starting from the second column
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const newCell = newRow.insertCell();
            newCell.textContent = row[colIndex].toFixed(3); // Format the number to show 3 decimal places
        }
    }
}

    createAvmtChart() {
      console.log('Creating the chart...');
      // Specify the file path
      const chartDataPath = this.chartData; //'dummy_roadway_trends.json'
    
      if (typeof chartDataPath === 'undefined') return;
    
      fetch(chartDataPath)
          .then(response => response.json())
          .then(data => {
              // Create chart container dynamically
              const chartContainer = document.createElement('div');
              chartContainer.id = 'chartContainer'; // Set the id for the chart container
          
              const labels = [];
              const avmtData = [];
          
              data.forEach(item => {
                  item.filterGroups.forEach(filterGroup => {
                      filterGroup.filterOptionData.forEach(filterSelection => {
                        filterSelection.filterSelectionData.forEach(data => {
                          Object.keys(data).forEach(segId => {
                              labels.push(segId);
                              avmtData.push(data[segId].aVMT);
                          });
                      });
                    });
                  });
              });
            
              const canvas = document.createElement('canvas'); // Create a canvas element for the chart
              const ctx = canvas.getContext('2d');
            
              new Chart(ctx, {
                  type: 'bar',
                  data: {
                      labels: labels,
                      datasets: [{
                          label: 'AVMT Data',
                          data: avmtData,
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1
                      }]
                  },
                  options: {
                      scales: {
                          y: {
                              beginAtZero: true
                          }
                      }
                  }
              });
            
              // Append the canvas to the provided container
              chartContainer.appendChild(canvas);
            
              // Append the chart container to the specified element in HTML
              const chartElement = document.getElementById('mainTrend');
              if (chartElement) {
                  chartElement.appendChild(chartContainer);
              }
          })
          .catch(error => {
              console.error('Error fetching or displaying data:', error);
          });
    }



  getSidebarSelector(submenuTemplate) {
    if (submenuTemplate === 'vizLog') {
        return '#logSidebarContent';
    } else if (submenuTemplate === 'vizMap') {
        return '#sidebarContent';
    } else if (submenuTemplate === 'vizTrends') {
        return '#trendSidebarContent'
    } else if(submenuTemplate === 'vizMatrix') {
        return '#matrixSidebarContent'
    }

}
}
