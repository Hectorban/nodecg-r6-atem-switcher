import ioHook from 'iohook'
import { Atem } from 'atem-connection'
import * as nodecgApiContext from './utils/nodecg-api-context'

const nodecg = nodecgApiContext.get()
const keypresRefRep: any = nodecg.Replicant("keyPressRef")

const ip1 = '192.168.0.140'
const ip2 = '192.168.0.141'

const numbersKeyRef = {
	"49":  1,
	"50":  2,
	"51":  3,
	"52":  4,
	"53":  5,
	"54":  6,
	"55":  7,
	"56":  8,
	"57":  9,
	"48":  10
}	

const numpadKeyRef = {
	"96":  10,
	"97":  1,
	"98":  2,
	"99":  3,
	"100": 4,
	"101":  5,
	"102":  6,
	"103":  7,
	"104":  8,
	"105":  9
}

async function main() {
  const [atem1, atem2] = [await connectAtem(ip1), await connectAtem(ip2)]

  atem1.on('connected', () => {
    console.log(`First atem connected, IP ${ip1}`)
    atem2.on('connected', () => {
      console.log(`Second atem connected, IP ${ip2}`)
      console.log('Beggining key listening...')
      initKeyLogger(atem1, atem2)
    })
  })
} 

async function initKeyLogger(atem1, atem2) {
  ioHook.on('keydown', async (event) => {
    const { rawcode } = event
		let keyboardNumber = 0
		if(rawcode >= 48 && rawcode <= 57) {keyboardNumber = numbersKeyRef[rawcode]} 	
		if(rawcode >= 96 && rawcode <= 105) {keyboardNumber = numpadKeyRef[rawcode]}
		if(keyboardNumber === 0) return
    const manualConversion = keypresRefRep.value[keyboardNumber-1].camera_index
		if(manualConversion >= 1 && manualConversion <= 5) {
			const sourceNumber = manualConversion + 3 
			atem1.changeProgramInput(sourceNumber).then(() => {
				console.log(`${sourceNumber}`)
			})
		}
		if(manualConversion >= 6 && manualConversion <= 10) {
			const sourceNumber = manualConversion - 2 
			atem1.changeProgramInput(3).then(() => {
				console.log(`Multiplex activated`)
			})
			atem2.changeProgramInput(sourceNumber).then(() => {
				console.log(`${sourceNumber}`)
			})
		}
  })
}

async function connectAtem(ip) {
  const atem = new Atem()
  atem.on('info', console.log)
  atem.connect(ip)
  return atem
}

main()

