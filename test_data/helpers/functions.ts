
//Helper function for primitive array equality
export function isEqual(arr1: string[], arr2:string[]) : boolean {
    const flag : boolean = false

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