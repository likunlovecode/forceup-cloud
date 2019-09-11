import {
  guard,
  typeOf,
} from 'mytoolkit'

export function pwd() {
  const pathname = window.location.pathname
  const lastIdx = pathname.lastIndexOf('/')
  if (lastIdx === -1) return ''

  return pathname.substr(0, lastIdx + 1)
}

export function docRoot() {
  let protocol = window.location.protocol
  let host = window.location.host
  let path = pwd()
  return `${protocol}//${host}${path}`
}

export const guardList = guard(value => typeOf(value) !== 'Array', [])
export const guardObj = guard(value => typeOf(value) !== 'Object', {})
export const guardNumber = guard(value => /^\d+$/.test(value), 0)

export function scaleBy(value, getActualValue) {
  return function (w) {
    let rv = getActualValue() || value
    return w * rv / value
  }
}
export function objectToFormData(obj) {
  let r = new FormData()
  let keys = Object.keys(obj)
  if (keys.length > 0) {
    keys.forEach(k => {
      r.append(k, obj[k])
    })
  }
  return r
}

export function unitConversion(item){
  if(item <= 0){
    item = '0B';
    return item;
  }else{
    var k = 1024;
    var sizes = ['B','KB','MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var c = Math.floor(Math.log(item) / Math.log(k));
    item = (item / Math.pow(k, c)).toFixed(2) + ' ' + sizes[c];
    return item;
  }
}