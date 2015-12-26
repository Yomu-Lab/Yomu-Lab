module GlobalMessage

  STATUS_TRUE = 1                                                     #{GlobalMessage::STATUS_TRUE}
  STATUS_FALSE = 0                                                    #{GlobalMessage::STATUS_FALSE}
  
  STATUS_ACTIVE = 'Active'                                            #{GlobalMessage::STATUS_ACTIVE}
  STATUS_INACTIVE = 'Inactive'                                        #{GlobalMessage::STATUS_INACTIVE}
  
  LOGIN_FAIL_COUNT = 5                                                #{GlobalMessage::LOGIN_FAIL_COUNT}
  
  STATUS_YES = 'Yes'                                                  #{GlobalMessage::STATUS_YES}
  STATUS_NO = 'No'                                                    #{GlobalMessage::STATUS_NO}
  
  ROLE_SUPER_ADMIN = 'SuperAdmin'                                     #{GlobalMessage::ROLE_SUPER_ADMIN}
 
  # => MESSAGE TYPE
  MSG_INFO = 'Info'                                                   #{GlobalMessage::MSG_INFO}
  MSG_ERROR = 'Error'                                                 #{GlobalMessage::MSG_ERROR}
  MSG_SUCCESS = 'Success'                                             #{GlobalMessage::MSG_SUCCESS}
  MSG_WARNING = 'Warning'                                             #{GlobalMessage::MSG_WARNING}
  
  # => MESSAGE TYPE FOR APPLYING CSS
  MSG_TYPE_INFO = 'alert-info'
  MSG_TYPE_DANGER = 'alert-danger'
  MSG_TYPE_SUCCESS = 'alert-success'
  MSG_TYPE_WARNING = 'alert-warning'

  MSG_TYPE_INFO_CSS = 'response alert alert-info alert-dismissableinfo'
  MSG_TYPE_DANGER_CSS = "response alert alert-danger alert-dismissable"
  MSG_TYPE_SUCCESS_CSS = 'response alert alert-success alert-dismissable'
  MSG_TYPE_WARNING_CSS = 'response alert alert-warning alert-dismissable'

  
  # => GENDER TYPE
  GENDER_DEFAULT = 'MALE'                                             #{GlobalMessage::GENDER_DEFAULT}
  GENDER_MALE = 'MALE'                                                #{GlobalMessage::GENDER_MALE}
  GENDER_FEMALE = 'FEMALE'                                            #{GlobalMessage::GENDER_FEMALE}
  
  RECORD_PER_PAGE = '10'                                              #{GlobalMessage::RECORD_PER_PAGE}
  SMALL_RECORD_PER_PAGE = '4'                                         #{GlobalMessage::SMALL_RECORD_PER_PAGE}
  USERS_RECORD_PER_PAGE = '5'                                         #{GlobalMessage::USERS_RECORD_PER_PAGE}

  # => Messages
  LOGGED_SUCCESSFULLY = "You have logged in successfully." 
  SIGNING_UP_INVITE_FRIENDS = "Thank you for signing up. Invite your friends."
  SIGNING_UP_CONFIRM_EMAIL = "Thank you for signing up. Please confirm your email."

end