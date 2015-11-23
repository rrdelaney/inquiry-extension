import inquiry from './inquiry'
import { args, init, provider, consumer } from './partners/youtube'

/*
 * args
 *
 * List of all variables that should be required from the host page
 */

/*
 * Init
 *
 * Function that is called when the page is first initialized
 *
 * @param args {Object} Requested vars form host page
 * @param isLoaded {Function} Call to determine is video is already loaded
 * @param loadVideo {Function} Call to load video
 * @param done {Function} Call when done initializing
 */

 /*
  * Provider
  *
  * Function that should call search when appropriate
  *
  * @param args {Object} Requested vars form host page
  * @param search {Function} call with the video id and search term
  */

  /*
   * Consumer
   *
   * Gets called after searching with the results
   *
   * @param args {Object} Requested vars form host page
   * @param term {String} Term that was searched
   * @param results {Array} Results of the search
   */

inquiry(args, init, provider, consumer)
