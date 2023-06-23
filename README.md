# Voyager's Journey

![](https://th-thumbnailer.cdn-si-edu.com/N68s4bk8l3XV9iBolYmX2Qzdx9M=/fit-in/1600x0/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/Voyager-records-631.jpg)

## Description

This is an interactive visualization of NASA's mission through the solar system.

## Development

### Setup

For development, you will only need Node.js (preferably the latest LTS version) installed on your environment. After cloning the repository, run the following command to install the dependencies:

```shell
$ npm install
```

### Development server

To start the development server, run the following command:

```shell
$ npm run dev
```

It will start a development server on port 5173. You can access the development server at http://localhost:5173.


## Assignment

### Development process

After deciding the topic of the visualization and the framework to build it, we split the tasks into gathering data about the Voyager missions and building components of the page, namely the timeline and the solar system objects. As we gained a deeper understanding of the data, we developed the visualization iteratively, adding more features and improving the existing ones.


### Peer commentary

Some suggestions for improving the visualization were made by our peers, so we will comment on what was adopted and dismissed:

* The option to follow the probe was already a work in progress and was implemented in the final version of the visualization.
* A better description of the mission and the intent of the visualization was added to the main page, so as to contextualize the visualization.
* Better object highlighting: every object has a semi-transparent circle around it, making them more recognizable especially at lower zoom levels.
* The images were updated to different versions with a higher resolution.
* Added the trajectory of the probes only within the past few days, making it more visible, while also keeping the visualization clean.
* The timeline now has information about relevant moments in the mission, facilitating the navigation through the timeline.
* Some aspects of the font and unaccounted behavior when using light mode were fixed.

* We decided against filtering the images by planet because it can be achieved by going to the right moment in the timeline and checking the last images, and it would take too much additional logic and time to implement.
* With the timeline registering the important events, we felt it was unnecessary to click on a planet to jump to its moment in the timeline.
* A tooltip showing the names of the planets wouldn't bring that much information to the user and could cause issues with the moving nature of the elements.
