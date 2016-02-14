module GlobalConstant

  STATUS_TRUE = 1                                                     #{GlobalConstant::STATUS_TRUE}
  STATUS_FALSE = 0                                                    #{GlobalConstant::STATUS_FALSE}
  
  STATUS_ACTIVE = 'Active'                                            #{GlobalConstant::STATUS_ACTIVE}
  STATUS_INACTIVE = 'Inactive'                                        #{GlobalConstant::STATUS_INACTIVE}
  
  LOGIN_FAIL_COUNT = 5                                                #{GlobalConstant::LOGIN_FAIL_COUNT}
  
  STATUS_YES = 'Yes'                                                  #{GlobalConstant::STATUS_YES}
  STATUS_NO = 'No'                                                    #{GlobalConstant::STATUS_NO}
  
  ROLE_SUPER_ADMIN = 'SuperAdmin'                                     #{GlobalConstant::ROLE_SUPER_ADMIN}
 
  # => MESSAGE TYPE
  MSG_INFO = 'Info'                                                   #{GlobalConstant::MSG_INFO}
  MSG_ERROR = 'Error'                                                 #{GlobalConstant::MSG_ERROR}
  MSG_SUCCESS = 'Success'                                             #{GlobalConstant::MSG_SUCCESS}
  MSG_WARNING = 'Warning'                                             #{GlobalConstant::MSG_WARNING}
  
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
  GENDER_DEFAULT = 'MALE'                                             #{GlobalConstant::GENDER_DEFAULT}
  GENDER_MALE = 'MALE'                                                #{GlobalConstant::GENDER_MALE}
  GENDER_FEMALE = 'FEMALE'                                            #{GlobalConstant::GENDER_FEMALE}
  
  RECORD_PER_PAGE = '10'                                              #{GlobalConstant::RECORD_PER_PAGE}
  SMALL_RECORD_PER_PAGE = '4'                                         #{GlobalConstant::SMALL_RECORD_PER_PAGE}
  USERS_RECORD_PER_PAGE = '5'                                         #{GlobalConstant::USERS_RECORD_PER_PAGE}

  # => Article Status
  ARTICLE_STATUS_DRAFT = 'Draft'
  ARTICLE_STATUS_UNPUBLISHED = 'Unpublished'
  ARTICLE_STATUS_PUBLISHED = 'Published'

  # => Response Code
  CODE_200 = "Your changes have been saved successfully."
  CODE_400 = "Bad Request"
  CODE_401 = "Unauthorized"
  CODE_403 = "Forbidden"
  CODE_404 = "Not Found"
  CODE_500 = "Internal Server Error"


  RESPONSE_TYPE_SUCCESS = "success_box"
  RESPONSE_TYPE_ERROR = "error_box"

end