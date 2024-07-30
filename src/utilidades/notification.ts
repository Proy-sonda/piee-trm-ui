export const showNotification =(options:NotificationOptions, title:string, onClick?:()=> void, onClose?:()=> void )=>  {
    // Paso 2: Crear y mostrar la notificación
    const notification = new Notification(title, options);

    // Agregar eventos a la notificación (opcional)
    notification.onclick = () => {
        if(onClick){
            onClick();
        }        
    };

    notification.onclose = () => {
        if(onClose){
            onClose();
        }        
    };
  }