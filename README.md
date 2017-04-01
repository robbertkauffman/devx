# Dev-X

Dev-X is a developer application for Hippo CMS, aimed to make
developing with Hippo easier by providing a UI for common developer tasks.
Currently it only supports editing templates and component properties, but additional 
features will be added in the future.

## Installation

You have to add the required webservices, a custom valve and a custom response appender to your Hippo project.
Without these the tool will not work.

1. Build and add the dependencies to your local Maven repository by running the following command in the *dependencies*
 folder:
 ```
 cd dependencies
 mvn clean install
 ```
2. Add the jcr-api dependency to your Hippo project, by adding the following to the *essentials/pom.xml*:
 ```
 <dependency>
   <groupId>org.onehippo.devx</groupId>
   <artifactId>jcr-api</artifactId>
   <version>0.1.0-SNAPSHOT</version>
 </dependency>
 ```
3. Copy the file *dependencies/essentials/applicationContext.xml* to *essentials/src/main/resources* in your Hippo 
 project:
 ```
  cp dependencies/essentials/applicationContext.xml <YOUR_HIPPO_FOLDER>/essentials/src/main/resources
 ```
4. Add the site-services dependency to your Hippo project, by adding the following to the *site/pom.xml*:
 ```
 <dependency>
   <groupId>org.onehippo.devx</groupId>
   <artifactId>site-services</artifactId>
   <version>0.1.0-SNAPSHOT</version>
 </dependency>
 ```
5. Build the Dev-X Application
 ```
  cd app
  npm install
 ```
6. After the application has finished building, you can start the application by following the instructions in the next
 chapter: *Running the application*
 
## Running the application
After you have installed the application, you can run the application using the following command in the *app* folder:
```
npm start
```
Now you can access the application at [http://localhost:8000/index.html](http://localhost:8000/index.html).

## Compatibility
This tool has been created and tested on Hippo 11.2 with Chrome 56.x. 

## How it works
The application itself is built in AngularJS and uses Node Package Manager for dependency management and NodeJS as
local development server.

The site-services include two things, a custom valve and a response appender:
 * The custom valve exposes the HST model of a resolved page as JSON. This is only done when the request parameter
 *?devmode=true* is set. The JSON object gives the Dev-X application an hierarchical representation of the components
 on the page, which can be viewed and edited in the application.
 * The response appender adds a line of javascript to the HEAD element of the site for communicating the URL of the page
 back to the parent when the site is viewed in an iframe. Using this, the Dev-X application can track the URL of the 
 site while its loaded in an iframe and CORS is disabled.

## API Documentation
The application uses custom RESTful services to query and modify the HST configuration. These APIs are based on the 
work by Jeroen Reijn 
([REST services for the HST](www.jeroenreijn.com/2015/02/a_rest_api_for_the_hippocms_content_repository.html)).
When building the JCR-API with Maven, it will automatically create documentation in Markdown using Swagger. This can be 
found under *dependencies/generated/markdown/rest-api-docs.md*.

## Known issues
A list of the known issues can be found on the [DevX Trello board](https://trello.com/b/TPDdb0lb/hippo-devx).

## Author
&copy; 2017 BloomReach
by Robbert Kauffman

Kudos to Jeroen Reijn for his 
[REST services for the HST](www.jeroenreijn.com/2015/02/a_rest_api_for_the_hippocms_content_repository.html). The 
webservices of this application are based on his work.