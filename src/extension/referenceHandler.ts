import * as nodecgApiContext from './utils/nodecg-api-context'
import MasterList from "./utils/ref.json"

const nodecg = nodecgApiContext.get()

const masterReference = nodecg.Replicant("MasterReference")
masterReference.value = MasterList
console.log(masterReference.value)
