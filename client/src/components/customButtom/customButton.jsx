import React from 'react'

import './customButton.styles.scss'

const CustomButton = ({children,isGoogleSignIn,inverted, ...otherProps}) => (
    <button className={`${inverted ? 'inverted' : ''}  N${isGoogleSignIn ? 'google-sign-in' : ''} custom-button`} {...otherProps}>
        {children}
    </button>
)

export default CustomButton

