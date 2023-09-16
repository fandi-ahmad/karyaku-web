import React, { useEffect, useState } from 'react'
import { CheckLogged } from '../../components/checkLogged'
import { MiniNavbar, Navbar } from '../../components/Navbar'
import { BaseCard } from '../../components/BaseCard'
import { GetProjectListByUser, UpdateProject, DeleteProject } from '../../api/projectApi'
import { useGlobalState } from '../../state/state'
import { SimpleInput } from '../../components/baseInput'
import { BaseButton } from '../../components/BaseButton'
import { getId } from '../../function/baseFunction'
import { BaseAlert } from '../../components/BaseAlert'
const urlServer = process.env.KARYAKU_SERVER


const UserProjectList = () => {
  const [uuidUser, setUuidUser] = useGlobalState('uuidUser')
  const [profilePicture, setProfilePicture] = useGlobalState('profile_picture')
  const [projectList, setProjectList] = useState([])
  const [alertMsg, setAlertMsg] = useState('')
  const [alertType, setAlertType] = useState('')


  // for edit project
  const [uuid, setUuid] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [demoLink, setDemoLink] = useState('')
  const [sourceCode, setSourceCode] = useState('')
  const [projectImage, setProjectImage] = useState(null)
  const [projectImageUrl, setProjectImageUrl] = useState('')


  const getAllData = async () => {
    try {
      if (uuidUser) {
        getId('loading').classList.remove('hidden')
        const data = await GetProjectListByUser(uuidUser)
        setProjectList([...data.data]);
        getId('loading').classList.add('hidden')
      }
    } catch (error) {
      console.log(error, '<-- error get data');
    }
  }

  const handleInputFile = (e) => {
    const imageSelect = e.target.files[0];
  
    // get extension file
    const fileExtension = imageSelect.name.split(".").pop().toLowerCase();
  
    // check if extension is .jpg, .jpeg, .png
    if (["jpg", "jpeg", "png"].includes(fileExtension)) {
      setProjectImage(imageSelect);
      setProjectImageUrl(URL.createObjectURL(imageSelect));
    } else {
      showAlert('error', 'Hanya file dengan ekstensi .jpg, .jpeg, atau .png yang diterima.')
    }
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

  const showAlert = (type, message, id = 'alertMessage') => {
    setAlertType(type)
    setAlertMsg(message)
    getId(id).classList.remove('hidden')
    setTimeout(() => {
      getId(id).classList.add('opacity-0')
      setTimeout(() => {
        getId(id).classList.remove('opacity-0')
        getId(id).classList.add('hidden')
      }, 100);
    }, 2000);
  }

  const editProject = (data) => {
    setUuid(data.uuid)
    setTitle(data.title)
    setDescription(data.description)
    setDemoLink(data.demo_link)
    setSourceCode(data.source_code)
    setProjectImageUrl(urlServer+'/'+data.project_image)
  }

  const updateProject = async () => {
    try {
      if (title === '' || description === '') {
        showAlert('error', 'judul dan deskripsi harus terisi.')
      } else {
        const formData = new FormData();
        formData.append('uuid', uuid)
        formData.append('image_upload', projectImage)
        formData.append('title', title)
        formData.append('description', description)
        formData.append('demo_link', demoLink)
        formData.append('source_code', sourceCode)

        const response = await UpdateProject(formData)

        getId('closeModal').click()
        response.status === 200
        ? showAlert('success', 'project diperbarui', 'alertMessageList')
        : showAlert('error', 'terjadi kesalahan!', 'alertMessageList')
      
        setTimeout(() => {
          getAllData()
        }, 100);
      }
    } catch (error) {
      console.log(error, '<-- error update project');
    }
  }

  useEffect(() => {
    getAllData()
  }, [uuidUser])


  return (
    <>
      <CheckLogged />
      <Navbar/>
      <MiniNavbar/>
      <BaseAlert type={alertType} text={alertMsg} className='hidden' id='alertMessageList' />
      <div className='px-20 py-10'>
        <div className='w-full flex justify-center' id='loading'>
          <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          {projectList.map((project) => (
            <div className='flex flex-grow' key={project.uuid}>
              <BaseCard
                title={project.title}
                text={project.description}
                date={project.createdAt}
                projectImage={urlServer+'/'+project.project_image}
                profilePicture={profilePicture}
                demoLink={project.demo_link}
                sourceCode={project.source_code}
                showMenu='show'
                onClickEdit={() => editProject(project)}
              />
            </div>
          ))}
        </div>
      </div>

      <input type="checkbox" id="my_modal_62" className="modal-toggle" />
      <div className="modal">
        <BaseAlert type={alertType} text={alertMsg} className='hidden' id='alertMessage' />
        <div className="modal-box min-w-fit">
          <h3 className="font-bold text-lg mb-4">Edit Project</h3>
          <div className='modal-action'>
            <label htmlFor="my_modal_62" id='closeModal' className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              <i className="fa-solid fa-xmark"></i>
            </label>
          </div>
          <div className='flex justify-between overflow-y-auto' style={{maxHeight: '350px'}}>
            <div>
              <img className='rounded-md w-96 h-60 object-cover me-4 cursor-pointer hover:brightness-90 duration-200' src={projectImageUrl} alt="" onClick={() => getId('inputFile').click()} />
              <input type="file" id='inputFile' onChange={handleInputFile} className='hidden' />
            </div>
            <div className='w-96'>
              <SimpleInput placeholder='judul project' value={title} onChange={handleInput} name='title' className='font-bold mb-4' />
              <textarea placeholder="deskripsi singkat project" value={description} onChange={handleInput} name='description' className="mb-4 textarea textarea-bordered textarea-lg w-full h-56 no-resize"></textarea>
              <SimpleInput placeholder='demo link' value={demoLink} onChange={handleInput} name='demoLink' className='mb-4' />
              <SimpleInput placeholder='source code' value={sourceCode} onChange={handleInput} name='sourceCode' className='mb-4' />
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <BaseButton text='selesai' onClick={updateProject} />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProjectList