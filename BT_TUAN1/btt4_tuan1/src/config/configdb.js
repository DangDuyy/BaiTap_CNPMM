import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('node_fullstack', 'root', 'puppyduylun365', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
})

let connectDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log("Connect successfully")

  } catch (error) {
    console.log('Unable to connect to the database: ', error)
  }
}

export default connectDatabase