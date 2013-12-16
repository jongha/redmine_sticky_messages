require 'redmine'
require 'sticky_messages_application_hooks'

Redmine::Plugin.register :redmine_sticky_messages do
  name 'Redmine Sticky Messages plugin'
  author 'Jong-Ha Ahn'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'http://github.com/jongha/redmine_sticky_messages'
  author_url 'http://www.mrlatte.net'
end
