import * as core from '@actions/core'
import { load } from 'js-yaml'
import { readFileSync } from 'fs'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const path: string = core.getInput('path', { required: true })

    core.debug(`Path: ${path}`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())

    const content: string = readFileSync(path, 'utf8')
    core.setOutput('content', content)

    const data: any = load(content)

    if (!data.services) {
      core.warning('No services found in the YAML file.')
      return
    }

    processData(data.services)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function processData(data: any): void {
  for (const key in data) {
    core.debug(`${key}: ${JSON.stringify(data[key])}`)
    core.info(`Found service ${key}`)
  }
}
