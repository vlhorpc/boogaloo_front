import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Message extends PureComponent {
  static propTypes = {
    currentUserId: PropTypes.number,
    currentChatUsers: PropTypes.array,
    currentUserData: PropTypes.object,
    isToShowUserInitials: PropTypes.bool,
    message: PropTypes.object
  };

  static defaultProps = {
    currentUserId: 0,
    currentChatUsers: [],
    currentUserData: {},
    isToShowUserInitials: true,
    message: {}
  };

  returnMessageData(message) {
    let resultMessage = message + '';
    const imagePattern = /https?:\/\/\S+\.(png|jpg)/gi;
    const boldPattern = /\*\*(.+?)\*\*/gi;
    const italicPattern = /\*(.+?)\*/gi;
    const newLinePattern = /(?:\r\n|\r|\n)/gi;

    const imageMatches = imagePattern.exec(message);
    const boldMatches = boldPattern.exec(message);
    const italicMatches = italicPattern.exec(message);
    const newLineMatches = newLinePattern.exec(message);

    if (imageMatches || boldMatches || italicMatches || newLineMatches) {
      resultMessage = resultMessage.replace(imagePattern, `<img src="$&" />`);
      resultMessage = resultMessage.replace(boldPattern, `<b>$1</b>`);
      resultMessage = resultMessage.replace(italicPattern, `<i>$1</i>`);
      resultMessage = resultMessage.replace(newLinePattern, `<br />`);

      return (
        <div dangerouslySetInnerHTML={{ __html: resultMessage }} />
      );
    }

    return resultMessage;
  }

  render() {
    const {
      message, currentUserId, currentChatUsers, currentUserData, isToShowUserInitials
    } = this.props;

    let userAvatar = null;
    let currentUser = null;

    if (message.user_id !== currentUserId) {
      currentUser = currentChatUsers.find(user => user.id === message.user_id);
    } else {
      currentUser = currentUserData;
    }

    userAvatar = currentUser && currentUser.images
      && currentUser.images.find(image => image.image_type === 'avatar');

    if (!currentUser) {
      return (
        <div />
      );
    }

    return (
      <div className="message-item">
        <div className="left-part">
          {isToShowUserInitials
            ? (
              <div className="user-avatar">
                {userAvatar
                  ? (
                    <div className="avatar-image">
                      {userAvatar.absolute_href
                        ? <img src={userAvatar.absolute_href} alt="avatar" />
                        : <img src={userAvatar.href} alt="avatar" />
                      }
                    </div>
                  )
                  : (
                    <div className="avatar-image">
                      <img src="/img/no_image.png" alt="avatar" />
                    </div>
                  )
                }
              </div>
            )
            : ''
          }
        </div>
        <div className="right-part">
          {isToShowUserInitials
            ? <div className="user-information">{currentUser.name} {currentUser.surname}</div>
            : ''
          }
          <div className="message">
            {this.returnMessageData(message.message)}
          </div>
        </div>
      </div>
    );
  }
}
