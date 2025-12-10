import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LuUser } from "react-icons/lu";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiPlusCircle } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { load_profile, ProfileData } from "@/lib/savload/load_file";
import { save_profile_setting } from "@/lib/savload/save_file";
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { DelModal } from "./delModal";

export const Profile = ({
  savfileSlot,
  setSavefileSlot
}:{
  savfileSlot: string,
  setSavefileSlot: Dispatch<SetStateAction<string>>
}) => {
  const [ modalActive, setModalActive ] = useState<boolean>(false)
  const [ active, setActive ] = useState<boolean>(false)
  const [ currSavSlot, setCurrSavSlot ] = useState<string|undefined>(undefined)
  const [ profileData, setProfileData ] = useState<ProfileData|undefined>(undefined)

  useEffect(()=>{
    if(!active) {
      if(currSavSlot !== undefined) {
        if(savfileSlot !== currSavSlot) {
          setSavefileSlot(currSavSlot)
        }
        save_profile_setting(profileData)
      }
    }

    if(currSavSlot === undefined) {
      const load_profile_setting = async() => {
        const data = await load_profile()
        if(data !== undefined && data?.curr !== undefined && Array.isArray(data?.ary) && data?.ary.find(v=>v.uuid === data.curr) !== undefined) {
          setProfileData(data)
          setCurrSavSlot(data.curr)
          setSavefileSlot(data.curr)
        }
        else {
          const new_uuid = uuidv4()
          const default_data = {
            curr: new_uuid,
            ary: [
              {
                uuid: new_uuid,
                alias: 'My Profile :)'
              }
            ]
          }
          save_profile_setting(default_data)
          setProfileData(default_data)
          setCurrSavSlot(new_uuid)
          setSavefileSlot(new_uuid)
        }
      }
      load_profile_setting()
    }
  }, [active, currSavSlot])

	return (
    <>
      <div
        className={`overlay ${active?'overlay-active cursor-pointer':''}`}
        onClick={()=>{
          if(active) setActive(false)
        }}
      >
        <div className="overlay-shadow" />
        <div className="drawer" onClick={e=>e.stopPropagation()}>
          { active && 
            <div className="w-full h-full flex flex-col gap-2">
              <div className="w-full ml-auto pt-2 pl-2 pr-2 flex flex-row gap-2">
                <div className="flex-1 flex flex-row gap-2 items-center mini-svg">
                  <LuUser />
                  <span className="font-bold text-lg memo-underline">Profile</span>
                </div>
                <button
                  className="theme-switch"
                  onClick={()=>{
                    if(active) setActive(false)
                  }}
                >
                  <MdCancel />
                </button>
              </div>

              <div className="relative flex-1 overflow-y-scroll mr-2 pb-3 px-2">
                <div className="flex flex-col gap-2">

                  { profileData.ary.map((data, i)=>{
                    return (
                      <div className="flex flex-row items-center gap-1" key={`profile slot ${data.uuid}`}>
                        <button className="div-border theme-switch" onClick={()=>{
                          const new_data = lodash.cloneDeep(profileData)
                          new_data.curr = data.uuid
                          setProfileData(new_data)
                          setCurrSavSlot(data.uuid)
                        }}>
                          { data.uuid === profileData.curr ?
                            <div className={`rotate-6`}>
                              <FaCheck className="fill-teal-500" />
                            </div>
                            : <LuUser />
                          }
                        </button>
                        <input className={`div-border py-1 px-2 ${data.uuid === profileData.curr ? 'font-bold' : 'opacity-50'}`} value={data?.alias ? data?.alias : ''}
                          onChange={(e)=>{
                            const new_data = lodash.cloneDeep(profileData)
                            new_data.ary[i].alias = e.target.value
                            setProfileData(new_data)
                          }}
                          onBlur={(e)=>{
                            if(e.target.value === ''){
                              const new_data = lodash.cloneDeep(profileData)
                              new_data.ary[i].alias = "My Profile :)"
                              setProfileData(new_data)
                            }
                          }}
                        />
                        <button className={`mini-svg ${profileData.ary.length <= 1 ? 'opacity-50':''}`} disabled={profileData.ary.length <= 1} onClick={()=>{setModalActive(true)}}>
                          <RiDeleteBin2Fill />
                        </button>
                        { modalActive &&
                          <DelModal
                            closeModal={()=>{setModalActive(false)}}
                            delFunc={()=>{
                              if(profileData.ary.length > 0) {
                                const new_data = lodash.cloneDeep(profileData)
                                new_data.ary.splice(i, 1)
                                if(currSavSlot === profileData.curr) {
                                  setCurrSavSlot(new_data.ary[0].uuid)
                                  new_data.curr = new_data.ary[0].uuid
                                }
                                setProfileData(new_data)
                              }
                            }}
                          />
                        }
                      </div>
                      )
                    })
                  }

                  <hr className="opacity-50" />

                  <button className="div-border mini-svg flex flex-row items-center justify-center" onClick={()=>{
                    const new_data = lodash.cloneDeep(profileData)
                    new_data.ary.push({
                      uuid: uuidv4(),
                      alias: 'New Profile!'
                    })
                    setProfileData(new_data)
                  }}>
                    <BiPlusCircle />
                    <span>add new profile</span>
                  </button>

                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <button
        className="theme-switch"
        onClick={()=>{
          setActive(!active)
        }}
      >
        <LuUser />
      </button>
    </>
	)
}