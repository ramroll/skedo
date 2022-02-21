import express from 'express'
import { Application } from './Application'
import { HelloController } from './controllers/HelloController'

new HelloController()
Application.getCurrentApplication().listen()