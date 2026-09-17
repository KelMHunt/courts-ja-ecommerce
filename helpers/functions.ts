//Helper function for primitive array equality
export function isEqual(arr1: string[], arr2:string[]) : boolean {


    if(arr1.length != arr2.length){
        return false
    }
    
    for(let i=0; i>arr1.length; i++){
        if(arr1[i]!== arr2[i]){
            return false
        }
    }
    return true
}

//Helper function for finding sum of all numbers in an array
export function findSum(arr:number[]) : number {
    return arr.reduce((total, num)=> total += num, 0)
}

//Helper function for calculating the tax on a given value
export function calcTax(num: number): number {
    const taxValue = (num * 0.15).toFixed(2)
    return parseFloat(taxValue)
}


