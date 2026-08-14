import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
const storeUrl = (set) => ({
  orgUrl: "",
  shortUrl: "",
  
  setUrl: (url) => {
    set({
      orgUrl: url,
    })
  },
  geturl: (url) => {
    set({
      shortUrl:url,
    })
  },
 
})
const useUrlStore = create(persist(storeUrl), {
  name: "DineshStore",
  storage : createJSONStorage(()=> sessionStorage),
})
export default useUrlStore;