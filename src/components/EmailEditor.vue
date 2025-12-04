<template>
  <div class="email-editor">
    <div class="editor-toolbar">
      <div class="toolbar-section">
        <button @click="addText" class="toolbar-btn">
          <span>📝</span> Texto
        </button>
        <button @click="addButton" class="toolbar-btn">
          <span>🔘</span> Botón
        </button>
        <button @click="addImage" class="toolbar-btn">
          <span>🖼️</span> Imagen
        </button>
        <button @click="addDivider" class="toolbar-btn">
          <span>➖</span> Divisor
        </button>
      </div>
      
      <div class="toolbar-section">
        <select v-model="selectedFont" @change="updateStyle('fontFamily', selectedFont)">
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        
        <input type="color" v-model="selectedColor" @change="updateStyle('color', selectedColor)">
        
        <button @click="bold = !bold" :class="['toolbar-btn', bold ? 'active' : '']">
          <strong>B</strong>
        </button>
        
        <button @click="italic = !italic" :class="['toolbar-btn', italic ? 'active' : '']">
          <em>I</em>
        </button>
      </div>
    </div>

    <div class="editor-preview" ref="preview">
      <div class="email-container">
        <div 
          v-for="(element, index) in elements" 
          :key="index"
          :class="['email-element', { 'selected': selectedElement === index }]"
          @click="selectElement(index)"
          :style="element.styles"
        >
          <div v-if="element.type === 'text'" contenteditable="true" @blur="updateElementContent(index, $event)">
            {{ element.content }}
          </div>
          
          <div v-else-if="element.type === 'button'" class="email-button" :style="element.styles">
            <a href="#" style="text-decoration: none; color: inherit;">
              {{ element.content }}
            </a>
          </div>
          
          <div v-else-if="element.type === 'image'" class="email-image">
            <img :src="element.content" alt="Image" style="max-width: 100%;">
            <input type="file" @change="updateImage(index, $event)" accept="image/*">
          </div>
          
          <hr v-else-if="element.type === 'divider'">
        </div>
      </div>
    </div>

    <div class="editor-sidebar">
      <div v-if="selectedElement !== null" class="element-properties">
        <h3>Propiedades</h3>
        
        <div class="property-group">
          <label>Contenido:</label>
          <textarea 
            v-model="elements[selectedElement].content" 
            @input="updateElementContent(selectedElement, $event)"
            rows="3"
          ></textarea>
        </div>
        
        <div class="property-group">
          <label>Color:</label>
          <input type="color" v-model="elements[selectedElement].styles.color" @change="updateElementStyle('color')">
        </div>
        
        <div class="property-group">
          <label>Tamaño fuente:</label>
          <input type="number" v-model="elements[selectedElement].styles.fontSize" @change="updateElementStyle('fontSize')">
          <span>px</span>
        </div>
        
        <div class="property-group">
          <label>Alineación:</label>
          <select v-model="elements[selectedElement].styles.textAlign" @change="updateElementStyle('textAlign')">
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
          </select>
        </div>
        
        <button @click="deleteElement" class="delete-btn">Eliminar Elemento</button>
      </div>
      
      <div class="template-variables">
        <h3>Variables Disponibles</h3>
        <div class="variable-list">
          <div v-for="variable in variables" :key="variable" class="variable-item" @click="insertVariable(variable)">
            {{ variable }}
          </div>
        </div>
      </div>
    </div>

    <div class="editor-actions">
      <button @click="saveTemplate" class="save-btn">Guardar Plantilla</button>
      <button @click="exportHTML" class="export-btn">Exportar HTML</button>
      <button @click="previewEmail" class="preview-btn">Vista Previa</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const elements = ref([])
const selectedElement = ref(null)
const selectedFont = ref('Arial')
const selectedColor = ref('#000000')
const bold = ref(false)
const italic = ref(false)

const variables = ref([
  '{{company_name}}',
  '{{username}}',
  '{{email}}',
  '{{full_name}}',
  '{{password}}',
  '{{current_date}}'
])

function addText() {
  const newElement = {
    type: 'text',
    content: 'Escribe tu texto aquí...',
    styles: {
      fontSize: '16px',
      color: '#000000',
      textAlign: 'left',
      fontFamily: 'Arial',
      padding: '10px'
    }
  }
  elements.value.push(newElement)
  selectedElement.value = elements.value.length - 1
}

function addButton() {
  const newElement = {
    type: 'button',
    content: 'Click aquí',
    styles: {
      backgroundColor: '#8557FB',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '5px',
      textAlign: 'center',
      display: 'inline-block',
      fontSize: '16px',
      margin: '10px'
    }
  }
  elements.value.push(newElement)
  selectedElement.value = elements.value.length - 1
}

function addImage() {
  const newElement = {
    type: 'image',
    content: '',
    styles: {
      textAlign: 'center',
      padding: '10px'
    }
  }
  elements.value.push(newElement)
  selectedElement.value = elements.value.length - 1
}

function addDivider() {
  const newElement = {
    type: 'divider',
    content: '',
    styles: {
      margin: '20px 0',
      border: 'none',
      borderTop: '2px solid #ccc'
    }
  }
  elements.value.push(newElement)
  selectedElement.value = elements.value.length - 1
}

function selectElement(index) {
  selectedElement.value = index
}

function updateElementContent(index, event) {
  if (event.target) {
    elements.value[index].content = event.target.innerText || event.target.value
  }
}

function updateElementStyle(property) {
  if (selectedElement.value !== null) {
    // Forzar actualización reactiva
    elements.value = [...elements.value]
  }
}

function updateStyle(property, value) {
  if (selectedElement.value !== null) {
    elements.value[selectedElement.value].styles[property] = value
  }
}

function deleteElement() {
  if (selectedElement.value !== null) {
    elements.value.splice(selectedElement.value, 1)
    selectedElement.value = null
  }
}

function insertVariable(variable) {
  if (selectedElement.value !== null && elements.value[selectedElement.value].type === 'text') {
    elements.value[selectedElement.value].content += ` ${variable} `
  }
}

function updateImage(index, event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      elements.value[index].content = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function exportHTML() {
  const html = generateHTML()
  console.log('HTML generado:', html)
  // Aquí puedes guardar el HTML en tu base de datos
  return html
}

function generateHTML() {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f4; padding: 20px; }
        .email-container { background: white; border-radius: 10px; overflow: hidden; }
        .email-content { padding: 20px; }
        .email-button { display: inline-block; padding: 12px 24px; background: #8557FB; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-content">
  `
  
  elements.value.forEach(element => {
    if (element.type === 'text') {
      html += `<div style="${objectToStyles(element.styles)}">${element.content}</div>`
    } else if (element.type === 'button') {
      html += `<a href="#" class="email-button" style="${objectToStyles(element.styles)}">${element.content}</a>`
    } else if (element.type === 'image' && element.content) {
      html += `<div style="${objectToStyles(element.styles)}"><img src="${element.content}" alt="Image" style="max-width: 100%;"></div>`
    } else if (element.type === 'divider') {
      html += `<hr style="${objectToStyles(element.styles)}">`
    }
  })
  
  html += `
        </div>
      </div>
    </body>
    </html>
  `
  
  return html
}

function objectToStyles(obj) {
  return Object.entries(obj).map(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    return `${cssKey}: ${value}`
  }).join('; ')
}

function saveTemplate() {
  const html = exportHTML()
  // Guardar en base de datos
  localStorage.setItem('emailTemplate', html)
  alert('Plantilla guardada exitosamente!')
}

function previewEmail() {
  const html = exportHTML()
  const newWindow = window.open()
  newWindow.document.write(html)
  newWindow.document.close()
}

onMounted(() => {
  // Cargar plantilla guardada si existe
  const saved = localStorage.getItem('emailTemplate')
  if (saved) {
    // Aquí podrías parsear el HTML guardado y convertirlo a elementos
  }
})
</script>

<style scoped>
.email-editor {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 80vh;
  padding: 20px;
}

.editor-toolbar {
  grid-column: 1 / -1;
  background: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.toolbar-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.toolbar-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
}

.toolbar-btn.active {
  background: #8557FB;
  color: white;
}

.editor-preview {
  background: white;
  border-radius: 10px;
  padding: 20px;
  overflow: auto;
}

.email-container {
  max-width: 600px;
  margin: 0 auto;
  min-height: 400px;
}

.email-element {
  margin: 10px 0;
  padding: 5px;
  border: 1px dashed transparent;
}

.email-element.selected {
  border-color: #8557FB;
}

.email-button {
  cursor: pointer;
}

.editor-sidebar {
  background: white;
  border-radius: 10px;
  padding: 20px;
  overflow-y: auto;
}

.element-properties, .template-variables {
  margin-bottom: 20px;
}

.property-group {
  margin-bottom: 15px;
}

.property-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.property-group input, .property-group select, .property-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.variable-item {
  padding: 8px;
  background: #f0f0f0;
  border-radius: 5px;
  cursor: pointer;
}

.variable-item:hover {
  background: #e0e0e0;
}

.delete-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.editor-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.save-btn, .export-btn, .preview-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.save-btn { background: #8557FB; color: white; }
.export-btn { background: #28a745; color: white; }
.preview-btn { background: #17a2b8; color: white; }
</style>