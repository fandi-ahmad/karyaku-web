import React, { useState } from 'react'
import { CheckLogged } from '../../components/checkLogged'
import { SimpleInput } from '../../components/baseInput'
import { useNavigate } from 'react-router-dom'
import { CreateProject } from '../../api/projectApi'
import { BaseButton } from '../../components/BaseButton'
import { useGlobalState } from '../../state/state'
import { getId } from '../../function/baseFunction'


const AddProject = () => {
  const navigate = useNavigate()
  const [uuidUser, setUuidUser] = useGlobalState('uuidUser')
  const [projectImage, setProjectImage] = useState(null)
  const [projectImageUrl, setProjectImageUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [demoLink, setDemoLink] = useState('')
  const [sourceCode, setSourceCode] = useState('')


  const createProject = async () => {
    try {
      const formData = new FormData();
      formData.append('uuid_user', uuidUser)
      formData.append('image_upload', projectImage)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('demo_link', demoLink)
      formData.append('source_code', sourceCode)

      const create = await CreateProject(formData)

      console.log(create, '<-- success');
      
    } catch (error) {
      console.log(error, '<-- error create project');
    }
  }

  const handleInputFile = (e) => {
    const imageSelect = e.target.files[0]
    setProjectImage(imageSelect)
    setProjectImageUrl(URL.createObjectURL(imageSelect))
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'title': setTitle(value); break;
      case 'description': setDescription(value); break
      case 'demoLink': setDemoLink(value); break;
      case 'sourceCode': setSourceCode(value); break;
      default: break;
    }
  };

  const btnCreateProject = () => {
    createProject()
  }

  const showHideProjectImage = () => {
    if (!projectImage) {
      return (
        <label className="custum-file-upload flex" htmlFor="file">
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
          </div>
          <div className="text">
            <span>Click to upload image</span>
          </div>
          <input type="file" id="file" onChange={handleInputFile} />
        </label>
      )
    } else {
      return (
        <>
          <img src={projectImageUrl} alt="" className='rounded-md hover:brightness-90 cursor-pointer duration-200 w-full' onClick={() => getId('inputFile').click()} />
          <input type="file" id='inputFile' className='hidden' onChange={handleInputFile} />
        </>
      )
    }
  }

  return (
    <>
      <CheckLogged />
      <div className='px-20 py-10'>

        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-2xl'>Project Baru</h1>
          <div className='cursor-pointer' title='close' onClick={() => navigate('/')}>
            <i className="fa-solid fa-xmark fa-2xl"></i>
          </div>
        </div>

        <hr className='my-8' />

        <button className='btn' onClick={() => console.log(projectImage)}>cek</button>

        <div className='flex flex-row w-100'>
          <div className='w-96 mr-20'>
            {showHideProjectImage()}
          </div>

          <div className='flex-grow'>
            <SimpleInput label='judul project' placeholder='judul project' className='mb-4' value={title} name='title' onChange={handleInput} />
            <label className="w-full text-start capitalize">deskripsi singkat project</label>
            <textarea placeholder="deskripsi singkat project" name='description' value={description} onChange={handleInput} className="mb-4 textarea textarea-bordered textarea-lg w-full h-64 no-resize"></textarea>
            <div className='flex justify-between'>
              <div className='flex-grow mr-8'>
                <SimpleInput name='demoLink' value={demoLink} onChange={handleInput} label={<><i className="fa-solid fa-play mr-1"></i> demo link</> } placeholder='demo link' className='mb-4' />
              </div>
              <div className='flex-grow'>
                <SimpleInput name='sourceCode' value={sourceCode} onChange={handleInput} label={<><i className="fa-brands fa-github mr-1"></i> source code</>} placeholder='source code' className='mb-4' />
              </div>
            </div>

            <div className='mt-5 flex justify-end'>
              <BaseButton className='btn-primary' text='buat sekarang' onClick={btnCreateProject}  />
            </div>

          </div>
        </div>



      </div>
    </>
  )
}

export default AddProject