import { Town } from '../town'

/**
 * 行政村
 */

interface Village {
  _id: string
  // 村名,或者街道名
  name: string

  town: Town
}

export { Village }
