export const filterFormatter = (s) => {
  if (s) {
    let r = s.toLowerCase()
    r = r.replace(/\\s/g, '')
    r = r.replace(/[àáâãäå]/g, 'a')
    r = r.replace(/æ/g, 'ae')
    r = r.replace(/ç/g, 'c')
    r = r.replace(/[èéêë]/g, 'e')
    r = r.replace(/[ìíîï]/g, 'i')
    r = r.replace(/ñ/g, 'n')
    r = r.replace(/[òóôõö]/g, 'o')
    r = r.replace(/œ/g, 'oe')
    r = r.replace(/[ùúûü]/g, 'u')
    r = r.replace(/[ýÿ]/g, 'y')
    r = r.replace(/\\W/g, '')
    return r
  } else {
    return s
  }
}
