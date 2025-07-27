<template>
    <div
        id="hero"
        class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
        style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
    >
        <div class="mx-6 md:mx-20 mt-0 md:mt-6">
            <h1 class="text-6xl font-bold text-gray-900 leading-tight">
                <span class="font-light block">Bienvenido a Uway</span>
                La plataforma de movilidad universitaria
            </h1>
            <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">
                Uway conecta universidades, conductores y estudiantes para facilitar el transporte seguro y eficiente. Las universidades pueden registrarse, sus conductores publicar rutas y los estudiantes encontrar la mejor opción para llegar a su destino.
            </p>
            <Button label="Comenzar" as="router-link" to="/" rounded class="!text-xl mt-8 !px-4"></Button>
        </div>
        <div class="flex justify-center md:justify-end">
            <img src="/demo/images/landing/screen-1.png" alt="Imagen principal Uway" class="w-9/12 md:w-auto" />
        </div>
    </div>
</template>
