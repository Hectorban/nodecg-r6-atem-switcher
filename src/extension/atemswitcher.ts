import ioHook from 'iohook'
import { Atem } from 'atem-connection'
import * as nodecgApiContext from './utils/nodecg-api-context'

const nodecg = nodecgApiContext.get()
const keypresRefRep: any = nodecg.Replicant("keyPressRef")

const numbersKeyRef:any = {
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

const numpadKeyRef:any = {
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

const startAtem = (ip:string, index:number) => {
	const myAtem = new Atem()
	myAtem.on('info', console.log)
	myAtem.connect(ip)
	myAtem.on('connected', () =>{
		console.log(`atem ID: ${ip} connected`)
		initKeyListener(index, myAtem)
	})
}

const initKeyListener = (AtemNumber: number, AtemClass: any) => {
	const firstRange = [1,6]
	const secondRange = [5,10]
	ioHook.on('keydown', async (event: { rawcode: number }) => {
		const { rawcode } = event
		let keyboardNumber = 0
		if(rawcode >= 48 && rawcode <= 57) {keyboardNumber = numbersKeyRef[rawcode]} 	
		if(rawcode >= 96 && rawcode <= 105) {keyboardNumber = numpadKeyRef[rawcode]}
		if(keyboardNumber === 0) return
    const manualConversion = keypresRefRep.value[keyboardNumber-1].camera_index
		if(manualConversion >= firstRange[AtemNumber] && manualConversion <= secondRange[AtemNumber]) {
			const sourceNumber = AtemNumber === 0 ? manualConversion + 3 : manualConversion - 2
			AtemClass.changeProgramInput(sourceNumber).then(() => {
				console.log(`${AtemNumber + 1} source, camera ${sourceNumber}`)
			})
		}
	})
  ioHook.start()
}

startAtem('192.168.100.240', 1)
startAtem('169.254.152.19', 0)