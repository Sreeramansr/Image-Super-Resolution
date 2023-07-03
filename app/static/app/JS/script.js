const tempImg = {
  fileName: null,
}

window.onload = () => {
  const imageUploadInput = document.getElementById('image-upload')
  const uploadImageArea = document.querySelector('.upload-image-area')
  const submitBtn = document.getElementById('submit-btn')
  const uploadText = uploadImageArea.querySelector('.upload-text')
  const outputImageArea = document.querySelector('.output-image-area')

  // Retrieve the CSRF token
  //const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value

  uploadImageArea.addEventListener('click', function () {
    imageUploadInput.click()
  })

  imageUploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0]
    const reader = new FileReader()
    if (!file) return
    reader.onload = function (e) {
      const inputImage = document.createElement('img')
      inputImage.id = 'input-image'
      inputImage.onload = function () {
        uploadText.style.display = 'none'
        inputImage.style.display = 'block'
      }
      inputImage.src = e.target.result

      if (uploadImageArea.hasChildNodes()) {
        uploadImageArea.replaceChild(inputImage, uploadImageArea.firstChild)
      } else {
        uploadImageArea.appendChild(inputImage)
      }
    }

    reader.readAsDataURL(file)
  })

  submitBtn.addEventListener('click', function () {
    if (uploadImageArea.querySelector('img') == null) {
      return
    }
    const file = imageUploadInput.files[0]
    const outputImage = document.createElement('img')
    outputImage.id = 'output-image'
    outputImageArea.innerText = 'Processing.. '
    if (!file) return
    const reader = new FileReader()
    const startTime = new Date().getTime() // Record the start time

    const elapsedSecText = document.createElement('p')
    elapsedSecText.id = 'elapsed-sec-text'
    outputImageArea.appendChild(elapsedSecText)

    const updateElapsedTime = () => {
      const currentTime = new Date().getTime()
      const elapsedTime = ((currentTime - startTime) / 1000).toFixed(2) // Calculate elapsed time in seconds
      elapsedSecText.innerText = `${elapsedTime} sec`
    }

    reader.onload = async () => {
      const base64 = reader.result
      tempImg.fileName = file.name
      const image = await uploadImage(base64, file)
      clearInterval(interval) // Stop updating elapsed time
      outputImageArea.innerHTML = ''
      outputImage.src = `data:image/jpeg;base64,${image}`
      outputImageArea.appendChild(outputImage)
    }
    reader.readAsDataURL(file)
    const interval = setInterval(updateElapsedTime, 100)
  })
}

function getCookie(name, domain) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  const csrfToken = cookieValue ? cookieValue.pop() : ''

  // Set the CSRF token in the cookie for the specified domain
  document.cookie = `csrftoken=${csrfToken}; domain=${domain}; path=/`

  return csrfToken
}

const uploadImage = async (imageSrc, file) => {
  const url = 'image_resolution'
  const data = {
    image: imageSrc,
  }

  const csrfToken = getCookie('csrftoken', '192.168.0.41')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  const imageData = result.image
  return imageData
}

const clearImageArea = () => {
  const uploadImageArea = document.querySelector('.upload-image-area')
  const outputImageArea = document.querySelector('.output-image-area')
  if (uploadImageArea.querySelector('img') == null) return
  uploadImageArea.innerHTML = ''
  if (outputImageArea.querySelector('img') !== null) {
    const downloadImg = document.getElementById('download-btn')
    const outputImageIcon = document.createElement('img')
    outputImageIcon.src = '../static/app/icons/image.svg'
    outputImageIcon.className = 'image-icon'
    outputImageArea.innerHTML = ''
    downloadImg.removeAttribute('href')
    downloadImg.removeAttribute('download')
    outputImageArea.appendChild(outputImageIcon)
  }
  const recreatedUploadText = document.createElement('div')
  const uploadImageIcon = document.createElement('img')
  uploadImageIcon.src = '../static/app/icons/image.svg'
  uploadImageIcon.className = 'image-icon'
  recreatedUploadText.classList.add('upload-text')
  recreatedUploadText.textContent = 'Click to Upload Image'
  uploadImageArea.appendChild(recreatedUploadText)
  uploadImageArea.appendChild(uploadImageIcon)
}

const downloadImage = () => {
  const outputImageArea = document.querySelector('.output-image-area')
  if (outputImageArea.querySelector('img') == null) {
    return
  }
  const downloadImg = document.getElementById('download-btn')
  const outputImage = document.getElementById('output-image')
  downloadImg.href = outputImage.src
  downloadImg.download = tempImg.fileName.split('.')[0] + '_modified.jpg'
}
