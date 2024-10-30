const getProductStatusMessage = (status: string): string => {
  switch (status) {
    case 'ACTIVE': {
      return `${status} :large_green_circle:`
    }
    case 'DELETED': {
      return `${status} :red_circle:`
    }
    case 'REJECTED': {
      return `${status} :red_circle:`
    }
    default: {
      return `${status} :large_yellow_circle:`
    }
  }
}

export default getProductStatusMessage
