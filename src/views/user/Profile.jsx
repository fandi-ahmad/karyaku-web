import React, { useState, useEffect } from 'react'
import { Navbar, MiniNavbar } from '../../components/Navbar'
import { SimpleInput } from '../../components/baseInput'
import { ProfileCard } from '../../components/ProfileCard'
import profilePictureEmpty from '../../assets/images/blank-profile-picture.png'
import { CheckLogged } from '../../components/checkLogged'
import { useGlobalState } from '../../state/state'
import { GetUserProfile, UpdateUserProfile } from '../../api/userApi'
import { useNavigate } from 'react-router-dom'
const urlServer = process.env.KARYAKU_SERVER

const Profile = () => {
  const [uuidUser, setUuidUser] = useGlobalState('uuidUser')
  const [username, setUsername] = useGlobalState('username')
  const [alertSuccessEdit, setAlertSuccessEdit] = useGlobalState('alertSuccessEdit')
  const [newUsername, setNewUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [category, setCategory] = useState('')
  const [address, setAddress] = useState('')
  const [work, setWork] = useState('')
  const [link, setLink] = useState('')
  const [biodata, setBiodata] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const navigate = useNavigate()

  const getUserProfile = async () => {
    try {
      if (uuidUser) {
        const user = await GetUserProfile(uuidUser)
        const data = user.data

        setProfilePicture(`http://${urlServer}/${data.profile_picture}`)
        setFullname(data.fullname)
        setCategory(data.category)
        setAddress(data.address)
        setWork(data.work)
        setLink(data.link)
        setBiodata(data.biodata)
        
      }
    } catch (error) {
      console.log(error, '<-- error');
    }
  }



  useEffect(() => {
    getUserProfile()
  }, [uuidUser])

  return (
    <>
      <CheckLogged />
      <Navbar/>
      <MiniNavbar/>
      <div className={`alert alert-success w-fit absolute top-5 right-20 transition-all duration-200 ${alertSuccessEdit}`} id='succesEdit'>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Data berhasil diperbarui</span>
      </div>
      <div className='px-20 pt-10 flex flex-row'>
        <div className="avatar cursor-pointer tooltip tooltip-bottom h-full" data-tip='edit foto profile' onClick={() => navigate('/profile/edit')}>
          <div className="w-72 h-72 rounded-full">
            <img src={profilePicture || profilePictureEmpty} className='w-full' />
          </div>
        </div>

        <ProfileCard className='' id='profileCard'
          username={username}
          fullname={fullname}
          category={category}
          button={<button className="btn btn-sm btn-primary capitalize" onClick={() => navigate('/profile/edit')}>Edit profile</button>}
          address={address}
          work={work}
          link={link}
          biodata={biodata}
        />

      </div>
    </>
  )
}

export default Profile