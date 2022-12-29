import { useState, useEffect } from "react"
import { db } from "./firebase-config"
import { collection, getDocs, addDoc, onSnapshot, updateDoc,deleteDoc, doc } from "firebase/firestore"

function App() {
  const [newFName, setNewFName] = useState("")
  const [newLName, setNewLName] = useState(0)

  const [ users, setUsers] = useState([])
  const userCollectionRef = collection(db, "users")

  const createUser = async (e) => {
    e.preventDefault()
    await addDoc(userCollectionRef, {name: newFName, lname: Number(newLName)})
    
  }

  const updateUser = async (id, lname) => {
    const userDoc = doc(db, "users", id)
    const newFields = {lname: lname + 1}
    await updateDoc(userDoc, newFields)
  }

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id)
    await deleteDoc(userDoc)
    
  }


  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef)
      setUsers(data.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    getUsers()

    const unsubscribe = onSnapshot(userCollectionRef, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    )
    return () => unsubscribe()


}, [])

  return (
   <>
   <form onSubmit={createUser}>

   <input placeholder="Enter your name" onChange={(e) => {
      setNewFName(e.target.value)
   }}/>
   <input type="number" placeholder="Enter your age" onChange={(e) => {
      setNewLName(e.target.value)
   }}/>
   <button type="submit">Submit</button>
   </form>
   {users.map(user => (
    <div>
      <h1>{user.name}</h1>
      <h1>{user.lname}</h1>
      <button onClick={() => {updateUser(user.id, user.lname)}}>Add Age</button>
      <button onClick={() => {deleteUser(user.id)}}>Delete user</button>
    </div>
   ))}
   </>
  )
}

export default App
