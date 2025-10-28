export const validateEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

export const validateAlphaNumeric = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(password)
}

export const validateFormEntryBody = (body: Record <string, any>, formItem: Record<string, any>[]) => {
    const formError: Record<string, string> = {}
    const obj: Record<string, any> = {}
    formItem.forEach(({key, required, type, defaultValue} ) => {
          const value = body[key]
          if (defaultValue === undefined && required && (value === undefined || value === null || value === "")) {
            formError[key] = `${key} is required`
          }else if (value !== undefined || value !== null) {
            switch(type) {
              case "email":
                if (!validateEmail(value)) {
                  formError[key] = `Invalid ${key}`
                }
                break
              case "password":
                if (!validateAlphaNumeric(value)) {
                  formError[key] = `Invalid ${key}`
                }
                break
            }
          }
          obj[key] = value
        })
        return {obj, formError}
}